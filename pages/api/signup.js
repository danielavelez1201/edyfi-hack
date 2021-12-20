import db from '../../firebase/clientApp'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
//import * as twilio from 'twilio';

//const client = twilio(authToken, accountSid);
const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const client = require('twilio')(accountSid, authToken)

async function handler(req, res) {
  console.log('in api')
  // Get community
  const communityId = req.body.headers.communityId
  const communityQuery = query(collection(db, 'communities'), where('communityId', '==', communityId))
  const communityDocs = await getDocs(communityQuery)
  if (communityDocs.docs.length === 0) {
    res.status(401).json('This onboarding link is invalid')
  }
  const community = communityDocs.docs[0]

  // Incorrect community token
  if (community.data().password !== req.body.token) {
    res.status(401).json('Incorrect community token.')
  }

  const googleUser = req.body.headers.googleUser

  /**
   * Inputs: Phone number + google login
   *
   * Cases:
   *
   * 1) Account existed already with this google login, not with this phone number though
   *
   * => New phone number! Update phone number for this user
   *
   * 2) An account existed already with this phone number
   *
   * That account has a different google acc
   * => Error, don't wanna allow ppl to impersonate others w their phone number
   *    User must log in with own phone number or correct google acc (TODO: add support for multiple google accs)
   *
   * That account has no google acc attached yet
   * => Yay let's add the google info to that account
   *
   * 3) Account existed already with BOTH this google login and this phone number
   *
   * => Welcome back! Go to community directory
   *
   * 4) No account exists with either
   *
   * => Open up other form inputs
   */

  // User query with phone number
  const phoneNum = req.body.headers.phoneNum
  const userQueryByPhone = query(collection(db, 'users'), where('phone', '==', phoneNum))
  const userByPhone = userQueryByPhone.docs[0]

  // User query with google info
  const userQueryByGoogle = query(collection(db, 'users'), where('googleUser', '==', googleUser))
  const userByGoogle = userQueryByGoogle.docs[0]

  if (userByPhone) {
    // The existing account has google account info
    if (userByPhone.googleUser) {
      if (!googleUser) {
        res.status(300).json('Your phone number is tied to a google account. Please log in with google.')
      }
      // An account existed already with the phone number but with a diff google acc
      else if (googleUser !== userByPhone.googleUser) {
        res.status(300).json('Your phone number is tied to a different google account.')
      }
    }

    // The existing account does not have google account info yet
    if (googleUser) {
      userByPhone.update({ googleInfo: googleUser })
      console.log('Google info updated')
    }

    // Add user to community user array
    community.users.push(userByPhone.uuid)
  }

  if (googleUser) {
    // User existed with different phone number
    if (userByGoogle && userByGoogle.phoneNum !== phoneNum) {
      userByGoogle.update({ phoneNum: phoneNum })
      console.log('Phone number updated')
    }
    // Add user to community user array if not already added
    if (!userByPhone) {
      community.users.push(userByGoogle.uuid)
    }
  }

  const isPhoneInCommunity = await getDocs(community.users.includes(userByPhone.uuid))
  const isGoogleAccInCommunity = await getDocs(community.users.includes(userByGoogle.uuid))
  if (isPhoneInCommunity || isGoogleAccInCommunity) {
    res.status(200).json({ msg: 'success' })
  } else if (!req.body.firstName) {
    // Prompt other form input fields
    res.status(400).json({ msg: 'needs to make account' })
  } else {
    // Create user
    const docRef = await addDoc(collection(db, 'users'), {
      ...req.body,
      communityId: communityId,
      lastUpdated: Date.now()
    })

    // Add user to community user array
    community.users.push(docRef.docs[0].uuid)
  }

  res.status(200).json('Signup successful')
}

export default handler
