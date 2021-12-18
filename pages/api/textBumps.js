import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
// const client = require('twilio')(accountSid, authToken);
// cronJob = require('cron').CronJob;

// var textJob = new cronJob( '0 18 * * *', function(){
//     // at 0 minutes 18 hours every day
//     client.messages.create( { to:'+19549559235', from:'+15593541895', body:'Hello!' }, function( err, data ) {});
//   },  null, true);

async function handler(req, res) {
  // const communityId = req.headers.communityid;
  // const q = query(collection(db, 'users'), where("communityId", "==", communityId));
  const q = query(collection(db, 'users'))

  const users = await getDocs(q)
  let userCommunities = {} // user:[[community1,community2],phone]

  users.forEach((user) => {
    let userData = user.data()
    userData.firstName in userCommunities
      ? userCommunities[userData.firstName][0].push(userData.communityId)
      : (userCommunities[userData.firstName] = [[userData.communityId], userData.phone, userData.updated])
  })
  var today = new Date().toLocaleDateString()
  console.log(userCommunities)
  
  for (const [key, value] of Object.entries(userCommunities)) {
    if (value[2].split('/')[0] <= today.split('/')[0] - 3) {
      // textJob.start();
    }
  }
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
