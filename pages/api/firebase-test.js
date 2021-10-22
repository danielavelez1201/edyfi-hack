import db from '../../firebase/clientApp'
import { collection, getDocs } from 'firebase/firestore'

export default async function handler(req, res) {
  const snapshot = await getDocs(collection(db, 'test'))
  snapshot.forEach((doc) => {
    console.log({ doc: doc.data() })
  })
  res.status(200).json({ test: doc.data() })
}
