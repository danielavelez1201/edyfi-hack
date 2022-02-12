const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const client = require('twilio')(accountSid, authToken)

async function handler(req, res) {
  await client.messages.create({
    body: "You've signed up for Loop! We'll send you updates about other group members and what they're up to.",
    from: '+15593541895',
    to: '+19549559235'
  })
}

export default handler
