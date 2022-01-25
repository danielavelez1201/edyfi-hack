import db from '../../firebase/clientApp'
import { collection, addDoc } from 'firebase/firestore'

async function handler(req, res) {
  try {
    const docRef = await addDoc(collection(db, 'communities'), {
      communityId: req.body.formData.communityId,
      communityToken: req.body.formData.communityToken,
      adminGoogleUser: req.headers.googleUser,
      lastUpdated: Date.now(),
      users: []
    })

    console.log('Document written with ID: ', docRef.id)
    res.status(200).json({ msg: 'success' })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export default handler
