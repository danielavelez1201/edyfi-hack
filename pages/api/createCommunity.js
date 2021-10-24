import db from '../../firebase/clientApp'
import { collection, addDoc } from 'firebase/firestore'

async function handler(req, res) {
  try {
    const docRef = await addDoc(collection(db, 'communities'), {
      ...req.body,
      lastUpdated: Date.now()
    });

    console.log('Document written with ID: ', docRef.id)
    res.status(200).json({ msg: 'success' })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export default handler
