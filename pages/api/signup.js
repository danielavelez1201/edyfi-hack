import db from '../../firebase/clientApp'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
//import * as twilio from 'twilio';

//const client = twilio(authToken, accountSid);
const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const client = require('twilio')(accountSid, authToken)

async function handler(req, res) {
  const communityId = req.body.headers.communityId
  const googleUser = req.body.headers.googleUser
  const q = query(collection(db, 'communities'), where('communityId', '==', communityId))
  const community = await getDocs(q)

  if (community.docs.length === 0) {
    res.status(401).json('This onboarding link is invalid')
  }

  // User connected google account
  if (googleUser) {
    const existingUserInCommunity = await getDocs(
      query(
        collection(db, 'users'),
        where('googleUser', '==', req.body.googleUser),
        where('communityIds', 'array-contains', communityId)
      )
    )

    if (existingUserInCommunity.docs.length > 0) {
      res.status(300).json("Looks like you're already in this community!")
    }

    // Add community Id to existing array
    const existingUserProfileDocs = await getDocs(
      query(collection(db, 'users'), where('googleUser', '==', req.body.googleUser))
    )
    const existingUserProfile = existingUserProfileDocs.docs[0]
    existingUserProfile.update({ communityIds: existingUserProfile.communityIds.push(communityId) })
    res.status(200).json('Login successful')
  }

  // User did not connect google account
  const q1 = await getDocs(
    query(
      collection(db, 'users'),
      where('email', '==', req.body.email),
      where('communityIds', 'array-contains', communityId)
    )
  )
  const q2 = await getDocs(
    query(
      collection(db, 'users'),
      where('phone', '==', req.body.phone),
      where('communityIds', 'array-contains', communityId)
    )
  )

  if (community.docs[0].data().password === req.body.token) {
    if (q1.docs.length > 0 || q2.docs.length > 0) {
      res.status(300).json("Looks like you're already in this community!")
    } else {
      res.status(200).json('Login successful')
    }
  } else if (community.docs[0].data().communityToken === req.body.token) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...req.body,
        communityId: communityId,
        lastUpdated: Date.now()
      })

      // Send signup text
      // await client.messages
      //   .create({
      //     body: "You've signed up for Loop! We'll send you updates about other group members and what they're up to.",
      //     from: '+15593541895',
      //     to: req.body.phone
      //   })
      //   .then((message) => console.log(message.sid))

      console.log('Document written with ID: ', docRef.id)
      res.status(200).json({ msg: 'success' })
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  } else {
    res.status(401).json('Incorrect community token.')
  }
}

export default handler
