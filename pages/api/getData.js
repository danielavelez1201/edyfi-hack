import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

async function handler(req, res) {
  console.log(req.headers)

  const q = query(collection(db, 'communities'), where('communityId', '==', req.headers.communityid))

  const userList = []
  const communityDocs = await getDocs(q)
  const communityDoc = communityDocs.docs[0].data()
  await communityDoc.users.forEach(async (id) => {
    const userQuery = query(collection(db, 'users'), where('__name__', '==', id))
    const userDocs = await getDocs(userQuery)
    userList.push(userDocs.docs[0].data())
  })

  res.status(200).json(userList)
}

export default handler
