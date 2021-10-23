import { doc, getDoc } from 'firebase/firestore';


async function handler(req, res) {
    const ref = doc(db, 'users');

    const doc = await getDoc(ref);

    if (doc.exists()) {
        console.log("Document data", doc.data());
    } else {
        console.log("No document found");
    }

    res.status(200).json(doc)
}

export default handler