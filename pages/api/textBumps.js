import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const Twilio = require('twilio')(accountSid, authToken)
// cronJob = require('cron').CronJob;

// var textJob = new cronJob( '0 18 * * *', function(){
//     // at 0 minutes 18 hours every day
//     client.messages.create( { to:'+19549559235', from:'+15593541895', body:'Hello!' }, function( err, data ) {});
//   },  null, true);

async function handler(req, res) {
  const q = query(collection(db, 'users'))

  const users = await getDocs(q)
  let userCommunities = []

  users.forEach((user) => {
    let userData = user.data()
    console.log(userData)
    userCommunities.push(userData)
  })
  let today = new Date().getTime()

  userCommunities.forEach((user) => {
    if (user.lastUpdated <= today - 26914471572 && user.lastSent <= today - 2629800000) {
      // 7889400000 - actual number
      user.lastSent = today // IMPLEMENT IN FB
      await Twilio.messages
        .create({
          body: `Hey, ${user.firstName}! It's been a few months since you updated your information for ${
            user.communityId
          }: 1) ${user.firstName} ${user.lastName}, 2) ${user.email}, in 3) ${location}, 4) ${user.role} at 5) ${
            user.work
          }, working on projects 6) ${projects.map((p) => `${p}, `)}, and you 7) ${offers.map(
            (h) =>
              `${
                h == 'investors'
                  ? `can intro to investors${offers.length > 1 && ', '}`
                  : h == 'cofounders'
                  ? `${offers.length > 1 && 'and '}are searching for cofounders${offers.length > 2 && ', '}`
                  : h == 'refer'
                  ? `${offers.length > 2 && 'and '}can refer to a job${offers.length > 3 && ', '}`
                  : h == 'hiring'
                  ? `${offers.length > 3 && 'and '}are hiring`
                  : null
              }`
          )}. Wanna update any field (yes/no)?`,
          from: '+15593541895',
          to: `+${user.phone}`
        })
        .then((message) => console.log(message.sid))

      let twiml = new Twilio.twiml.MessagingResponse()

      const body = event.Body ? event.Body.toLowerCase() : null
      switch (body) {
        case 'yes':
          twiml.message('To update send one text with the following format: 2,newemail@gmail.com,3,NYC')
          user.lastUpdated = today // if they respond
          user.updated = today
          break
        case 'no':
          twiml.message(
            `Great! Check out the community if you haven't in a while: https://keeploop.io/onboard/${user.communityId}`
          )
          user.lastUpdated = today // if they respond
          user.updated = today
          break
        case ',':
          twiml.message(
            `Great! Check out the community if you haven't in a while: https://keeploop.io/onboard/${user.communityId}`
          )
          user.lastUpdated = today // if they respond
          user.updated = today
        default:
          twiml.message('Sorry, I only understand yes, no, or a correct update response')
          break
      }

      callback(null, twiml)

      
      console.log('HERE', user.lastUpdated)
    }
  })
  //   await client.messages
  //     .create({
  //       body: "You've signed up for Loop! We'll send you updates about other group members and what they're up to.",
  //       from: '+15593541895',
  //       to: user.phone
  //     })
  //     .then((message) => console.log(message.sid))
}
handler()

// async function projectUpdateTemplate(name, projects) {
//   let result = ''
//   result += 'Hey! Sliding in with a lil update from ' + communityId + '.'
//   result += name
//   result += 'has been working on some rad projects! Some of which include '
//   projects.forEach((project) => {
//     result += project + ', '
//   })
//   result += 'etc.'
// }

// export default handler;
