import { collection, query, getDocs, doc, where, updateDoc } from 'firebase/firestore'
import db from '../../../firebase/clientApp'

async function handler(req, res) {
  const q = query(collection(db, 'communities'), where('communityId', '==', req.body.communityId))

  const communityDocs = await getDocs(q)

  const communityDoc = communityDocs.docs[0]

  const interests = communityDoc.data().interests

  req.body.newInterest.forEach(async (interest) => {
    const firstCapitalizedInterest = interest.charAt(0).toUpperCase() + interest.slice(1).toLowerCase()
    if (!interests.includes(firstCapitalizedInterest)) {
      console.log(firstCapitalizedInterest)
      await updateDoc(communityDoc.ref, { interests: [...interests, firstCapitalizedInterest] })
    }
  })

  res.status(200).json({})
}

export default handler
