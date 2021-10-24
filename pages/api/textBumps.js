// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const client = require('twilio')(accountSid, authToken);
// cronJob = require('cron').CronJob;

// var textJob = new cronJob( '0 18 * * *', function(){
//     // at 0 minutes 18 hours every day
//     client.messages.create( { to:'+19549559235', from:'+15593541895', body:'Hello!' }, function( err, data ) {});
//   },  null, true);

// async function handler(req, res) {
//     console.log(authToken, accountSid)

//     const communityId = req.headers.communityid;

//     function projectUpdateTemplate(name, projects) {
//         let result = ""
//         result += "Hey! Sliding in with a lil update from " + communityId + "."
//         result += name
//         result += "has been working on some rad projects! Some of which include "
//         projects.forEach((project) => {
//             result += project + ", "
//         })
//         result += "etc."
//     }

//     const q = query(collection(db, 'users'), where("communityId", "==", communityId));

//     const users = await getDocs(q);

//      users.forEach((user) => {
//         user.data()
//         await client.messages
//         .create({
//             body: 'You\'ve signed up for Loop! We\'ll send you updates about other group members and what they\'re up to.',
//             from: '+15593541895',
//             to: '+19549559235'
//         })
//         .then(message => console.log(message.sid));
//     })

// }

// export default handler;
