import db from '../../firebase/clientApp'
import { collection, addDoc } from 'firebase/firestore'
//import * as twilio from 'twilio';



//const client = twilio(authToken, accountSid);
const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const client = require('twilio')(accountSid, authToken); 

async function handler(req, res) {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...req.body,
      lastUpdated: Date.now()
    });

    // Send signup text
    // await client.messages
    // .create({
    //     body: 'You\'ve signed up for Loop! We\'ll send you updates about other group members and what they\'re up to.',
    //     from: '+15593541895',
    //     to: req.body.phone,
    // })
    // .then(message => console.log(message.sid));

    console.log('Document written with ID: ', docRef.id)
    res.status(200).json({ msg: 'success' })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export default handler
