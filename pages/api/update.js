import { collection, query, getDocs, where, updateDoc } from 'firebase/firestore'
import db from '../../firebase/clientApp'

async function handler(req, res) {
  console.log(req.body)
  const q = query(collection(db, 'users'), where('phoneNum', '==', req.body.phoneNum))

  const communityDocs = await getDocs(q)
  const communityDoc = communityDocs.docs[0]

  await updateDoc(communityDoc.ref, {
    industry: req.body.industry,
    interests: req.body.interests,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    asks: req.body.asks,
    offers: req.body.offers,
    phoneNum: req.body.phoneNum,
    email: req.body.email,
    lastUpdated: req.body.updated,
    location: req.body.location,
    projects: req.body.projects,
    randomBump: req.body.randomBump,
    role: req.body.role,
    work: req.body.work,
    targetedBump: req.body.targetedBump
  })

  res.status(200).json({})
}

export default handler
