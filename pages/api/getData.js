import { doc, getDoc, collection } from 'firebase/firestore';
import db from '../../firebase/clientApp'

const ref = doc(collection(db, 'users'));

async function handler(req, res) {
    
    const doc = await getDoc(ref);

    if (doc.exists()) {
        console.log("Document data", doc.data());
    } else {
        console.log("No document found");
    }

    res.status(200).json(doc)
}

export default handler