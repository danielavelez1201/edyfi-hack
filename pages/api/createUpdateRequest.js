import db from '../../firebase/clientApp'
import { query, collection, getDocs, addDoc, where } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

async function handler(req, res) {
  try {
    const token = uuidv4()

    const queryUser = query(collection(db, 'users'), where('email', '==', req.body.email))

    const userDoc = await getDocs(queryUser)
    // console.log({ userDoc: userDoc.data() })

    const userDocs = []
    userDoc.forEach((doc) => userDocs.push(doc.data()))

    if (userDocs.length === 0) {
      res.status(500)
    }

    const docRef = await addDoc(collection(db, 'updateRequests'), {
      ...userDocs[0],
      token
    })

    // TODO: send email or text message
    console.log({ updateRequestToken: token })

    console.log('Document written with ID: ', docRef.id)
    res.status(200).json({ msg: 'success' })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export default handler
