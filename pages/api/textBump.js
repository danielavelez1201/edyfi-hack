import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const Twilio = require('twilio')(accountSid, authToken)

async function textBump(req, res) {
  const q = query(collection(db, 'users'))

  const users = await getDocs(q)
  let userCommunities = []

  users.forEach((user) => {
    let userData = user.data()
    userCommunities.push(userData)
  })
  let today = new Date().getTime()

  userCommunities.forEach(async (user) => {
    if (user.lastUpdated <= today - 7889400000 && user.lastSent <= today - 5259600000) {
      user.set({ lastSent: today }, { merge: true }) // not sure this actually changes in the firebase db
      await Twilio.messages
        .create({
          body: `Hey, ${user.firstName}! It's been a few months since you updated your information for ${
            user.communityIds[0]
          }: 1) ${user.firstName} ${user.lastName}, 2) ${user.email}, in 3) ${user.location}, 4) ${user.role} at 5) ${
            user.work
          }, 6) ${user.projects.length === 0 ? "aren't" : ''} working on ${
            user.projects.length === 0 ? 'projects' : ''
          } projects ${user.projects !== 0 ? user.projects.map((p) => ` ${p}`) : ''} and you 7) ${user.offers.map(
            (h) =>
              `${
                h == 'investors'
                  ? `can intro to investors`
                  : h == 'cofounders'
                  ? `${
                      user.offers[user.offers.length - 1] === 'cofounders' && user.offers.length !== 1 ? ' and ' : ' '
                    }are searching for cofounders`
                  : h == 'refer'
                  ? `${
                      user.offers[user.offers.length - 1] === 'refer' && user.offers.length !== 1 ? ' and ' : ' '
                    }can refer to a job`
                  : h == 'hiring'
                  ? `${
                      user.offers[user.offers.length - 1] === 'hiring' && user.offers.length !== 1 ? ' and ' : ' '
                    }are hiring`
                  : null
              }`
          )}. Want to update any fields (yes/no)?`,
          from: '15593541895',
          to: `${user.phoneNum}`
        })
        .then((message) => console.log(message.sid))
    }
  })
}

textBump()