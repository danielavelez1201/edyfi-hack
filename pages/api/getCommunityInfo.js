import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

async function handler(req, res) {
  try {
    const q = query(collection(db, 'communities'), where('communityId', '==', req.headers.communityid))

    const communityMatches = await getDocs(q)
    const communities = []

    communityMatches.forEach((doc) => communities.push(doc.data()))

    console.log({ communities })

    res.status(200).json(communities)
  } catch (e) {
    console.log(e)
  }
}

export default handler
