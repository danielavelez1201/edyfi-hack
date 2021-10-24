import db from '../../firebase/clientApp'
import { query, collection, addDoc, where } from 'firebase/firestore'

async function handler(req, res) {
  try {
    const q = query(collection(db, 'users'), where('token', '==', req.body.token))

    const docs = await getDocs(q)

    docs.forEach((doc) => {
      console.log({ doc: doc.data() })
    })

    // const docRef = await addDoc(collection(db, 'users'), {
    //   ...req.body,
    //   lastUpdated: Date.now()
    // })

    console.log('Document written with ID: ', docRef.id)
    res.status(200).json({ msg: 'success' })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export default handler
