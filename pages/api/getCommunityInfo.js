import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

async function handler(req, res) {
  try {
    const q = query(collection(db, 'community'), where('communityId', '==', req.headers.communityid))

    const community = await getDoc(q)

    res.status(200).json(community)
  } catch (e) {
    console.log('error')
  }
}

export default handler
