import { collection, query, getDocs, where, updateDoc } from 'firebase/firestore'
import db from '../../firebase/clientApp'

async function handler(req, res) {
  const communities = [req.headers.communityId]
  console.log(req.headers.googleuserid)

  // We're not returning all communities for now to focus on other features first

  /* // User is signed in with google so we need to also return all the communities
  if (req.headers.googleuser !== undefined) {
    // User query with google info
    const userQueryByGoogle = query(collection(db, 'users'), where('googleUser', '==', req.headers.googleuser))
    const userQueryByGoogleDocs = await getDocs(userQueryByGoogle)
    console.log('user query', userQueryByGoogleDocs.docs)
    const userId = userQueryByGoogleDocs.docs[0].ref.id
    const communityQuery = query(collection(db, 'communities'), where(userId, 'in', 'users'))
    const communityQueryDocs = await getDocs(communityQuery)
    console.log('community Docs', communityQueryDocs)
    communityQueryDocs.forEach((communityDoc) => communities.push(communityDoc.data().communityId))
  } */

  const q = query(collection(db, 'communities'), where('communityId', '==', req.headers.communityid))

  console.log(req.headers.communityid)
  const userQ = query(collection(db, 'users'), where('communityId', '==', req.headers.communityid))
  const users = await getDocs(userQ)

  const userListPromises = []
  const communityDocs = await getDocs(q)
  const communityDoc = communityDocs.docs[0].data()

  for (let i = 0; i < communityDoc.users.length; i++) {
    const userDocs = getDocs(query(collection(db, 'users'), where('__name__', '==', communityDoc.users[i])))
    userListPromises.push(userDocs)
  }

  const userList = await Promise.all(userListPromises)
  const userData = userList.map((user) => user.docs[0].data())

  const communityWithAddedUsers = communityDoc.users
  for (let i = 0; i < users.docs.length; i++) {
    const userId = users.docs[i].ref.id
    if (!communityDoc.users.includes(userId)) {
      communityWithAddedUsers.push(userId)
    }
  }

  console.log(req.headers)
  console.log('google user in api', req.headers.googleuserid)
  // can remove once community admins are updated
  if (req.headers.googleuserid !== undefined) {
    updateDoc(communityDocs.docs[0].ref, { adminGoogleUserId: req.headers.googleuserid })
  }

  res.status(200).json({
    communityToken: communityDoc.communityToken,
    users: userData,
    adminGoogleUserId: req.headers.googleuserid
  })
}

export default handler
