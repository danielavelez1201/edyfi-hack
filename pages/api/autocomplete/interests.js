import { collection, query, getDocs, where, updateDoc } from 'firebase/firestore'
import db from '../../../firebase/clientApp'

async function handler(req, res) {
  const q = query(collection(db, 'communities'), where('communityId', '==', req.headers.communityid))

  const communityDocs = await getDocs(q)

  const communityDoc = communityDocs.docs[0].data()

  const interests = communityDoc.interests

  console.log(req.body, req.newInterests)

  req.newInterests.forEach((interest) => {
      const firstCapitalizedInterest = interest.charAt(0).toUpperCase() + interest.slice(1).toLowerCase()
    if (!interests.includes(firstCapitalizedInterest)) {
      console.log(firstCapitalizedInterest)
      q.update({ interests: [...interests, firstCapitalizedInterest] })
    }
  })

  res.status(200).json({})
}

export default handler
