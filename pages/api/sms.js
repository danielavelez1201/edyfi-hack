const http = require('http')
const express = require('express')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const bodyParser = require('body-parser')
import { doc, getDoc, collection, query, getDocs, where, updateDoc, arrayUnion } from 'firebase/firestore'
import db from '../../firebase/clientApp'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/sms', async (req, res) => {
  const twiml = new MessagingResponse()
  const q = query(collection(db, 'users'), where('phoneNum', '==', req.body.From))
  const user = await getDocs(q)

  const body = req.body.Body ? req.body.Body.toLowerCase() : null
  const regex = /[0-9],/gm

  const userRef = user[0].ref
  const userData = user[0].data()

  switch (body) {
    case 'yes':
    case 'y':
      twiml.message('To update send one text with the following format: 2,newemail@gmail.com,3,NYC')
      updateDoc(
        userRef,
        {
          lastUpdated: new Date().getTime()
        },
        { merge: true }
      )
      break
    case 'no':
    case 'n':
      twiml.message(
        `Great! Check out the community if you haven't in a while: https://keeploop.io/onboard/${userData.communityId}`
      )
      updateDoc(
        userRef,
        {
          lastUpdated: new Date().getTime()
        },
        { merge: true }
      )
      break
    case body.match(/[0-9],\S/g) !== null:
      twiml.message(
        `Great! Check out the community if you haven't in a while: https://keeploop.io/onboard/${userData.communityId}`
      )
      let afterComma = 0
      const updates = body.split(',')
      updates.forEach((field, i) => {
        switch (field) {
          case '1':
            updateDoc(
              userRef,
              {
                firstName: updates[i + 1].split(' ')[0],
                lastName: updates[i + 1].split(' ')[1]
              },
              { merge: true }
            )
            break
          case '2':
            updateDoc(
              userRef,
              {
                email: updates[i + 1]
              },
              { merge: true }
            )
            break
          case '3':
            updateDoc(
              userRef,
              {
                location: updates[i + 1]
              },
              { merge: true }
            )
            break
          case '4':
            updateDoc(
              userRef,
              {
                role: updates[i + 1]
              },
              { merge: true }
            )
            break
          case '5':
            updateDoc(
              userRef,
              {
                work: updates[i + 1]
              },
              { merge: true }
            )
            break
          case '6':
            // remove all indexes includes 6. until the end or when 7 is hit
            const newProjects = []
            const seven = false
            updates.slice(i).forEach((field, i) => {
              if (field == '7') {
                seven = true
              }
              if (!seven) {
                newProjects.push(field)
              }
            })
            updateDoc(
              userRef,
              {
                projects: arrayUnion(newProjects)
              },
              { merge: true }
            )
            break
          case '7':
            twiml.message(`To update the offers you can help with, please visit keeploop.io/update`)
            break
          default:
            break
        }
      })
    default:
      twiml.message('Sorry, I only understand yes, no, or a correct update response (format 2,email@gmail.com)')
      break
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' })
  res.end(twiml.toString())
})

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337')
})
