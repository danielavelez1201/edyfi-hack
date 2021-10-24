import { doc, getDoc, collection, query, getDocs, where} from 'firebase/firestore';
import db from '../../firebase/clientApp'


async function handler(req, res) {
    console.log(req.body)
    const q = query(collection(db, 'communities'), where("communityId", "==", req.body.formData.communityId));
    
    
    const community = await getDocs(q);
    if (community.docs.length === 0) {
        res.status(401).json("Community does not exist")
    }
    if (community.docs[0].data().password === req.body.formData.communityToken) {
        res.status(200).json("Login successful")
    }
    else {
        res.status(401).json("Incorrect password")
    }
    
}

export default handler