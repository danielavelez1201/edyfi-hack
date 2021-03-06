import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

async function handler(req, res) {
  const q = query(collection(db, 'communities'), where('communityId', '==', req.body.formData.communityId))

  const community = await getDocs(q)
  if (community.docs.length === 0) {
    res.status(401).json('Community does not exist')
  } else if (community.docs[0].data().userId === req.headers.userid) {
    res.status(200).json('Login successful')
  } else {
    res.status(401).json('Access denied')
  }
}

export default handler
