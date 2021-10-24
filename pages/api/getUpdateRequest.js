import db from '../../firebase/clientApp'
import { query, collection, getDocs, addDoc, where } from 'firebase/firestore'

async function handler(req, res) {
  try {
    const q = query(collection(db, 'updateRequests'), where('token', '==', req.body.token))

    const docs = await getDocs(q)

    const updateRequestsDocs = []
    docs.forEach((doc) => updateRequestsDocs.push(doc.data()))
    console.log({ updateRequestsDocs })
    if (updateRequestsDocs.length === 0) {
      res.status(500)
    }

    // console.log('Document written with ID: ', docRef.id)
    res.status(200).json({ msg: 'success', user: updateRequestsDocs[0] })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export default handler
