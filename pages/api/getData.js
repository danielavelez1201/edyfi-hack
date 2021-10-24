import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

async function handler(req, res) {
  console.log(req.headers)

  const q = query(collection(db, 'users'), where('communityId', '==', req.headers.communityid))

  const users = await getDocs(q)
  const userList = []
  users.forEach((doc) => {
    userList.push(doc.data())
  })

  res.status(200).json(userList)
}

export default handler
