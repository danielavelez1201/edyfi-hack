import { collection, query, getDocs, where, updateDoc } from 'firebase/firestore'
import db from '../../firebase/clientApp'

async function handler(req, res) {
  const q = query(collection(db, 'users'), where('phoneNum', '==', req.body))

  const communityDocs = await getDocs(q)
  const communityDoc = communityDocs.docs[0].data()

  res.status(200).json({
    communityIds: communityDoc.communityIds,
    industry: communityDoc.industry,
    interests: communityDoc.interests,
    lastName: communityDoc.lastName,
    firstName: communityDoc.firstName,
    asks: communityDoc.asks,
    offers: communityDoc.offers,
    phoneNum: communityDoc.phoneNum,
    email: communityDoc.email,
    lastUpdated: communityDoc.lastUpdated,
    location: communityDoc.location,
    projects: communityDoc.projects,
    randomBump: communityDoc.randomBump,
    role: communityDoc.role,
    work: communityDoc.work,
    targetedBump: communityDoc.targetedBump
  })
}

export default handler
