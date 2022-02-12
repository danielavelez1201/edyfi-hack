import db from '../../firebase/clientApp'
import { collection, query, where, getDocs } from 'firebase/firestore'

async function handler(req, res) {
  // Get community
  const communityId = req.body.headers.communityId
  const communityQuery = query(collection(db, 'communities'), where('communityId', '==', communityId))
  const communityDocs = await getDocs(communityQuery)
  if (communityDocs.empty) {
    return res.status(401).json('This onboarding link is invalid')
  }

  const communityDoc = communityDocs.docs[0]

  return res.status(200).json({ communityBoard: communityDoc.data()?.board })
}

export default handler
