import db, { user } from '../../firebase/clientApp'
import { collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore'
//import * as twilio from 'twilio';

//const client = twilio(authToken, accountSid);
const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const client = require('twilio')(accountSid, authToken)

/**
 * Inputs: Phone number + google login
 *
 * Cases:
 *
 * 1) Account existed already with this google login, not with this phone number though
 *
 * => New phone number! Update phone number for this user (TODO: add modal that lets the user merge accounts)
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
async function handler(req, res) {
  // Get community
  const communityId = req.body.headers.communityId
  const communityQuery = query(collection(db, 'communities'), where('communityId', '==', communityId))
  const communityDocs = await getDocs(communityQuery)
  if (communityDocs.empty) {
    return res.status(401).json('This onboarding link is invalid')
  }
  const communityDoc = communityDocs.docs[0]
  const community = communityDoc.data()
  const communityWithAddedUser = community.users ?? []

  // Incorrect community token
  if (community.communityToken !== req.body.headers.token) {
    return res.status(401).json('Incorrect community token.')
  }

  const googleUser = req.body.headers.googleUser

  // To check if either phone or google acc is in community
  let isPhoneInCommunity = false
  let isGoogleAccInCommunity = false

  // User query with phone number
  const phoneNum = req.body.headers.phoneNum
  const userQueryByPhone = query(collection(db, 'users'), where('phone', '==', phoneNum))
  const userQueryByPhoneDocs = await getDocs(userQueryByPhone)
  const phoneAccExists = !userQueryByPhoneDocs.empty

  // User query with google info
  let googleAccExists = googleUser !== undefined
  let userQueryByGoogleDocs = null
  if (googleAccExists) {
    const userQueryByGoogle = query(collection(db, 'users'), where('googleUser', '==', googleUser))
    userQueryByGoogleDocs = await getDocs(userQueryByGoogle)
    googleAccExists = !userQueryByGoogleDocs.empty
  }

  if (phoneAccExists) {
    const userByPhoneDoc = userQueryByPhoneDocs.docs[0]
    const userByPhone = userByPhoneDoc.data()
    const phoneAccId = userByPhoneDoc.ref.id
    isPhoneInCommunity = community.users.includes(phoneAccId)

    // The existing account has google account info
    if (userByPhone.googleUser) {
      if (!googleUser) {
        return res.status(300).json('Your phone number is tied to a google account. Please log in with google.')
      }
      // An account existed already with the phone number but with a diff google acc
      else if (googleUser !== userByPhone.googleUser) {
        return res.status(300).json('Your phone number is tied to a different google account.')
      }
    }

    // The existing account does not have google account info yet, and we need to add the info
    if (googleUser !== undefined) {
      updateDoc(userByPhoneDoc.ref, { googleInfo: googleUser })
    }

    // Add user to community user array
    if (!communityWithAddedUser.includes(phoneAccId)) {
      communityWithAddedUser.push(phoneAccId)
    }
  }

  if (googleAccExists) {
    const userByGoogleDoc = userQueryByGoogleDocs.docs[0]
    const userByGoogle = userByGoogleDoc.data()
    const googleAccId = userByGoogleDoc.ref.id
    isGoogleAccInCommunity = community.users.includes(googleAccId)

    // User existed with different phone number
    if (userByGoogle && userByGoogle.phoneNum !== phoneNum) {
      updateDoc(userByGoogleDoc.ref, { phoneNum: phoneNum })
    }
    // Add user to community user array if not already added
    if (!communityWithAddedUser.includes(googleAccId)) {
      communityWithAddedUser.push(googleAccId)
    }
  }

  // User already in community
  if (isPhoneInCommunity || isGoogleAccInCommunity) {
    return res.status(200).json({ msg: 'success' })
  }

  // Need to make new user
  if (!googleAccExists && !phoneAccExists) {
    if (!req.body.firstName) {
      // Prompt other form input fields
      return res.status(400).json({ msg: 'needs to make account' })
    } else {
      // Create user
      if (req.body.headers.googleUser === undefined) {
        const docRef = await addDoc(collection(db, 'users'), {
          ...req.body,
          phoneNum: req.body.headers.phoneNum,
          communityIds: [communityId],
          lastUpdated: Date.now()
        })
        communityWithAddedUser.push(docRef.id)
      } else {
        const docRef = await addDoc(collection(db, 'users'), {
          ...req.body,
          googleUser: req.body.headers.googleUser,
          phoneNum: req.body.headers.phoneNum,
          communityIds: [communityId],
          lastUpdated: Date.now()
        })
        communityWithAddedUser.push(docRef.id)
      }
    }
  }

  // Set new user list in community
  updateDoc(communityDoc.ref, { users: communityWithAddedUser })
  return res.status(200).json('Signup successful')
}

export default handler
