import db from '../../firebase/clientApp'
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore'

/**
 * Input: Google login
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
 * => Error, sign up with a community onboarding link
 */
async function handler(req, res) {

  const googleUser = req.body.headers.googleUser

  // User query with phone number
  const phoneNum = req.body.headers.phoneNum
  const userQueryByPhone = query(collection(db, 'users'), where('phone', '==', phoneNum))
  const userQueryByPhoneDocs = await getDocs(userQueryByPhone)
  const phoneAccExists = !userQueryByPhoneDocs.empty

  // User query with google info
  const userQueryByGoogle = query(collection(db, 'users'), where('googleUser', '==', googleUser))
  const userQueryByGoogleDocs = await getDocs(userQueryByGoogle)
  const googleAccExists = !userQueryByGoogleDocs.empty

  if (phoneAccExists) {
    const userByPhoneDoc = userQueryByPhoneDocs.docs[0]
    const userByPhone = userByPhoneDoc.data()

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
    if (googleAccExists) {
      updateDoc(userByPhoneDoc.ref, { googleInfo: googleUser })
    }
  }

  if (googleAccExists) {
    const userByGoogleDoc = userQueryByGoogleDocs.docs[0]
    const userByGoogle = userByGoogleDoc.data()

    // User existed with different phone number
    if (userByGoogle && userByGoogle.phoneNum !== phoneNum) {
      updateDoc(userByGoogleDoc.ref, { phoneNum: phoneNum })
    }
  }

  // Need to make new user
  if (!googleAccExists && !phoneAccExists) {
    return res.status(400).json({ msg: 'needs to make account' })
  }

  return res.status(200).json('Login successful')
}

export default handler
