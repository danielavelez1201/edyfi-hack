import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

async function handler(req, res) {
  const q = query(collection(db, 'communities'), where('communityId', '==', req.body.formData.communityId))
  let data = null
  try {
    const community = await getDocs(q)
    data = community.docs[0].data()
    if (data.communityToken === req.body.formData.communityToken) {
      res.status(200).json('Login successful')
    } else {
      res.status(401).json('Incorrect password')
    }
  } catch {
    res.status(401).json('Community does not exist')
  }
}

export default handler
