import { doc, getDoc, collection } from 'firebase/firestore';
import db from '../../firebase/clientApp'



async function handler(req, res) {

    const ref = doc(collection(db, 'users'));
    
    const docItem = await getDoc(ref);

    if (docItem.exists()) {
        console.log("Document data", docItem.data());
    } else {
        console.log("No document found");
    }

    res.status(200).json(docItem)
}

export default handler