import db from '../../firebase/clientApp'
import { collection, getDocs, doc } from 'firebase/firestore'

export default async function handler(req, res) {
  const snapshot = await getDocs(collection(db, 'test'))

  res.status(200).json({ test: doc.data() })
}
