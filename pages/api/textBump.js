import { doc, getDoc, updateDoc, collection, query, getDocs, setDoc, arrayUnion } from 'firebase/firestore'
import { constants } from 'fs'
import db from '../../firebase/clientApp'

const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const Twilio = require('twilio')(accountSid, authToken)

async function handler(req, res) {
  const q = query(collection(db, 'users'))

  const users = await getDocs(q)
  let userCommunities = []

  users.forEach((user) => {
    const userData = user.data()
    const userRef = user.ref
    userCommunities.push([userData, userRef])
  })
  const today = new Date().getTime()

  const sentUsers = []

  userCommunities.forEach(async (user) => {
    const userData = user[0]
    const userRef = user[1]
    // if (userData.lastUpdated <= today - 7889400000 && userData.lastSent <= today - 5259600000) {
    if (userData.lastSent === 1646632931494) {
      sentUsers.push(userData)
      // await setDoc(
      //   userRef,
      //   {
      //     lastSent: today
      //   },
      //   { merge: true }
      // )
      await Twilio.messages.create({
        body: `Hey, ${userData.firstName}! It's been a few months since you updated your information for ${
          userData.communityIds[0]
        }: 1) ${userData.firstName} ${userData.lastName}, 2) ${userData.email}, in 3) ${userData.location}, 4) ${
          userData.role
        } at 5) ${userData.work}, 6) ${userData.projects.length === 0 ? "aren't" : ''} working on ${
          userData.projects.length === 0 ? 'projects' : ''
        } projects ${
          userData.projects !== 0 ? userData.projects.map((p) => ` ${p}`) : ''
        } and you 7) ${userData.offers.map(
          (h) =>
            `${
              h == 'investors'
                ? `can intro to investors`
                : h == 'cofounders'
                ? `${
                    userData.offers[userData.offers.length - 1] === 'cofounders' && userData.offers.length !== 1
                      ? ' and '
                      : ' '
                  }are searching for cofounders`
                : h == 'refer'
                ? `${
                    userData.offers[userData.offers.length - 1] === 'refer' && userData.offers.length !== 1
                      ? ' and '
                      : ' '
                  }can refer to a job`
                : h == 'hiring'
                ? `${
                    userData.offers[userData.offers.length - 1] === 'hiring' && userData.offers.length !== 1
                      ? ' and '
                      : ' '
                  }are hiring`
                : null
            }`
        )}. Want to update any fields (yes/no)?`,
        from: '15593541895',
        to: `${userData.phoneNum}`
      })
    }
  })
  return res.status(200).json(sentUsers)
}

export default handler
