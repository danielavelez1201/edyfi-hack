import db from '../../firebase/clientApp'
import { collection, setDoc, doc, getDoc } from 'firebase/firestore'

async function handler(req, res) {
    console.log("api")
    try {
        await setDoc(doc(db, 'users', '1'), {
            name: "John Doe",
            email: "johndoe@gmail.com",
            phone: "123-456-7890",
            location: "New York",
            work: "Google", // or open to work
            role: "Engineer",
            projects: [{name: 'nft',a: 'https://google.com'}, {name: "meta",a:'https://google.com'}], //current projects
            refer: true, // or no
            updated: "October 24",
        },)
        await setDoc(doc(db, 'users', '2'), {
            name: "The Doe",
            email: "thedoe@gmail.com",
            phone: "123-456-7891",
            location: "San Francisco",
            work: "🔎", // or open to work
            role: "",
            projects: [{name: 'web3',a:'https://google.com'}], //current projects
            refer: false, // or no
            updated: "October 24",
        },)
        await setDoc(doc(db, 'users', '3'), {
            name: "Big Doe",
            email: "bigdoe@gmail.com",
            phone: "123-456-7892",
            location: "Miami",
            work: "CompanyName", // or open to work
            role: "Founder",
            projects: [], //current projects
            refer: true, // or no
            updated: "October 24",
        },)

    const ref = doc(db, 'users', '1');
    
    const docItem = await getDoc(ref);
    console.log(docItem.exists())
    console.log(docItem.data())
    if (docItem.exists()) {
        console.log("Document data", docItem.data());
    } 

    res.status(200).json({ msg: 'success' })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export default handler