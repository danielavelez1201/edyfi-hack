import { collection, query, getDocs, where, updateDoc } from 'firebase/firestore'
import db from '../../../firebase/clientApp'

async function handler(req, res) {
  const q = query(collection(db, 'communities'), where('communityId', '==', req.headers.communityid))

  const communityDocs = await getDocs(q)

  const communityDoc = communityDocs.docs[0].data()

  const interests = communityDoc.interests

  q.update({interests: [...interests, req.body]})

  res.status(200).json({
    communityToken: communityDoc.communityToken,
    industries: communityDoc.interests
  })
}

export default handler
