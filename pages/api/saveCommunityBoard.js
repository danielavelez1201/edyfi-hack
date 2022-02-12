import db, { user } from '../../firebase/clientApp'
import { collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore'

async function handler(req, res) {
  // Get community
  const communityId = req.body.communityId
  const communityQuery = query(collection(db, 'communities'), where('communityId', '==', communityId))
  const communityDocs = await getDocs(communityQuery)

  if (communityDocs.empty) {
    return res.status(401).json('This onboarding link is invalid')
  }

  const communityDoc = communityDocs.docs[0]

  // Set community board
  updateDoc(communityDoc.ref, { board: req.body.board })

  return res.status(200).json('Community board update successful')
}

export default handler
