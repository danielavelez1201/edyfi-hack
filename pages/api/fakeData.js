import db from '../../firebase/clientApp'
import { collection, addDoc } from 'firebase/firestore'

async function handler(req, res) {
  try {
    await addDoc(collection(db, 'users'), {
      name: "Daniel Garcia Murillo", location: "SF", status: "Synthesis, cooking",
      lastUpdated: Date.now()
    })
    await addDoc(collection(db, 'users'), {
        name: "Silen Naihin", location: "Korea", status: "Minerva, OnDeck, coding cool stuff",
        lastUpdated: Date.now()
      })
    await addDoc(collection(db, 'users'), {
    name: "Daniela Velez", location: "Boston", status: "Looking for co-founder, in classes",
    lastUpdated: Date.now()
    })

    res.status(200).json({ msg: 'success' })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export default handler