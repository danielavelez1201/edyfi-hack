import { collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

async function handler(req, res) {
  const q = query(collection(db, 'communities'), where('communityId', '==', req.headers.communityid))

  const userListPromises = []
  const communityDocs = await getDocs(q)
  const communityDoc = communityDocs.docs[0].data()

  for (let i = 0; i < communityDoc.users.length; i++) {
    const userDocs = getDocs(query(collection(db, 'users'), where('__name__', '==', communityDoc.users[i])))
    userListPromises.push(userDocs)
  }

  const userList = await Promise.all(userListPromises)
  const userData = userList.map((user) => user.docs[0].data())

  res.status(200).json(userData)
}

export default handler
