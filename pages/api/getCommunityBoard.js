import db from '../../firebase/clientApp'
import { collection, query, where, getDocs } from 'firebase/firestore'

async function handler(req, res) {
  console.log('get communityBoard in api')
  console.log(req.body)
  // Get community
  const communityId = req.body.headers.communityId
  const communityQuery = query(collection(db, 'communities'), where('communityId', '==', communityId))
  console.log('after community query')
  const communityDocs = await getDocs(communityQuery)
  console.log('after commmunity Docs')
  if (communityDocs.empty) {
    return res.status(401).json('This onboarding link is invalid')
  }

  const communityDoc = communityDocs.docs[0]

  console.log('getting community board', communityDoc.data())

  return res.status(200).json({ communityBoard: communityDoc.data()?.board })
}

export default handler
