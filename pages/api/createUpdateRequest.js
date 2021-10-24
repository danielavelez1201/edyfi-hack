import db from '../../firebase/clientApp'
import { query, collection, getDocs, addDoc, where } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

async function handler(req, res) {
  try {
    const token = uuidv4()

    const queryUser = query(collection(db, 'users'), where('email', '==', req.body.email))

    const userDoc = await getDocs(queryUser)

    userDoc.forEach((doc) => {
      console.log({ doc: doc.data() })
    })

    console.log({ userDoc })

    if (userDoc.length !== 0) {
      // console
    }

    // docs.forEach((doc) => {
    //   console.log({ doc: doc.data() })
    // })

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
