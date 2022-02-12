import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const Twilio = require('twilio')(accountSid, authToken)

async function singleRandBump(req, res) {
  const community = req.body.communityid
  if (community.targetedMatching === 'on') {
    const q = query(collection(db, 'users'), where('communityIds', 'array-contains', community))
    const users = await getDocs(q)

    users.forEach((user) => {
      if (user.targetedBump) {
        const userData = user.data()
        const userRef = user.ref
        userCommunities.push([userData, userRef])
      }
    })

    const matchedUsers = [] // [[user1,id],[user2,id2],{match criteria}]
    userCommunities.forEach(async (user, upperIndex) => {
      const userData = user[0]
      const userRef = user[1]
      if (userData.targetedBump === true) {
        if (matchedUsers.length === 0 || matchedUsers.filter(([a, b, c]) => b === null).length === 0) {
          // checks if array is empty or all matched up
          matchedUsers.push([user, null, {}])
        } else {
          // match based on ask/offer and industry
          matchedUsers.forEach((possible, i) => {
            const possibleUserData = possible[0][0]
            const possibleUserRef = possible[0][1]
            const emptyPossibleMatch = matchedUsers[i][1]
            const reasonsForMatch = matchedUsers[i][2]

            let allPossiblesPushed = false
            if (emptyPossibleMatch === null) {
              const possibleMatches = []
              let matched = false
              const possibleOfferMatch = possibleUserData.asks.some((x) => userData.offers.includes(x))
              const possibleUserMatch = userData.asks.some((x) => possibleUserData.offers.includes(x))
              const possibleIndustryMatch = possibleUserData.industry === userData.industry
              const possibleLocationMatch = possibleUserData.location === userData.location
              const possibleInterestsMatch = userData.interests.some((x) => possibleUserData.interests.includes(x))
              const possibleRoleMatch = possibleUserData.role === userData.role

              const checkMatches = [
                possibleOfferMatch,
                possibleUserMatch,
                possibleIndustryMatch,
                possibleLocationMatch,
                possibleInterestsMatch,
                possibleRoleMatch
              ]

              if (userData.prevMatches === undefined || !possibleUserData.prevMatches.includes(userRef)) {
                // checks if they haven't matched in the past

                if ((possibleOfferMatch || possibleUserMatch) && possibleIndustryMatch) {
                  // offer/ask & industry & location and matches them
                  emptyPossibleMatch = user
                  matched = true

                  userRef.set(
                    {
                      prevMatches:
                        userData.prevMatches !== undefined
                          ? [...userData.prevMatches, possibleUserRef]
                          : [possibleUserRef]
                    },
                    { merge: true }
                  )
                  possibleUserRef.set(
                    {
                      prevMatches:
                        possibleUserData.prevMatches !== undefined
                          ? [...possibleUserData.prevMatches, userRef]
                          : [userRef]
                    },
                    { merge: true }
                  )
                  checkMatches.forEach((field, x) => {
                    if (field && x === 0) {
                      // if offers/asks match
                      const asksUserOne = possibleUserData.asks.filter((value) => userData.offers.includes(value))
                      reasonsForMatch['asksUser1'] = asksUserOne
                    } else if (field && x === 1) {
                      const asksUserTwo = possibleUserData.offers.filter((value) => userData.asks.includes(value))
                      reasonsForMatch['asksUser2'] = asksUserTwo
                    } else if (field && x === 2) {
                      // if industry match
                      reasonsForMatch['industry'] = possibleUserData.industry
                    } else if (field && x === 3) {
                      // if location match
                      reasonsForMatch['location'] = possibleUserData.location
                    } else if (field && x === 4) {
                      // if interests match
                      const interestsMatch = possibleUserData.interests.filter((value) =>
                        userData.interests.includes(value)
                      )
                      reasonsForMatch['interests'] = interestsMatch
                    } else if (field && x === 5) {
                      // if role match
                      reasonsForMatch['role'] = possibleUserData.role
                    }
                  })
                } else {
                  // stores in possible
                  const score = checkMatches.filter(Boolean).length
                  possibleMatches.push([score, user, checkMatches])
                  if (
                    matchedUsers.length === i ||
                    (i === matchedUsers.length - 1 && matchedUsers.length < userCommunities.length / 2)
                  ) {
                    // make sure all scores are compared, unless it's the end and there's more room (or the above if statement was true for any of the possibles)
                    allPossiblesPushed = true
                  }
                }
              }

              if (
                !matched &&
                allPossiblesPushed &&
                i === matchedUsers.length - 1 &&
                matchedUsers.length < userCommunities.length / 2
              ) {
                // if we reach the end but there's more room
                matchedUsers.push([user, null, {}])
              } else if (
                allPossiblesPushed &&
                !matched &&
                i === matchedUsers.length - 1 &&
                matchedUsers.length >= userCommunities.length / 2
              ) {
                // if we reach the end but no more room
                possibleMatches.sort((a, b) => {
                  return b[0] - a[0]
                })
                if (possibleMatches[0][0] >= 2) {
                  // if at least two things match
                  emptyPossibleMatch = possibleMatches[0][1] // user was stored in the second index
                  checkMatches.forEach((field, x) => {
                    if (field && x === 0) {
                      // if offers/asks match
                      const asksUserOne = possibleUserData.asks.filter((value) => userData.offers.includes(value))
                      possibleMatches[i][2]['asksUser1'] = asksUserOne
                    } else if (field && x === 1) {
                      const asksUserTwo = possibleUserData.offers.filter((value) => userData.asks.includes(value))
                      possibleMatches[i][2]['asksUser2'] = asksUserTwo
                    } else if (field && x === 2) {
                      // if industry match
                      possibleMatches[i][2]['industry'] = possibleUserData.industry
                    } else if (field && x === 3) {
                      // if location match
                      possibleMatches[i][2]['location'] = possibleUserData.location
                    } else if (field && x === 4) {
                      // if interests match
                      const interestsMatch = possibleUserData.interests.filter((value) =>
                        userData.interests.includes(value)
                      )
                      possibleMatches[i][2]['interests'] = interestsMatch
                    } else if (field && x === 5) {
                      // if role match
                      possibleMatches[i][2]['role'] = possibleUserData.role
                    }
                  })
                  matched = true
                }

                // otherwise the user doesn't get matched?
              }
            }
          })
        }
      }
    })

    const today = new Date().getTime()
    matchedUsers.forEach(async (match) => {
      const person1Array = match[0]
      const person2Array = match[1]
      const person1 = person1Array[0]
      const person2 = person2Array[0]
      const common = match[2]
      let conversationSID = ''
      person1Array[1].set({ lastSent: today }, { merge: true })
      person2Array[1].set({ lastSent: today }, { merge: true })

      await Twilio.conversations.conversations
        .create({ friendlyName: `${person1.communityId} Connection` })
        .then((conversation) => {
          conversationSID = conversation.sid
        })

      await Twilio.conversations.conversations(conversationSID).participants.create({
        identity: 'Loop Bot',
        'messagingBinding.projectedAddress': '+15593541895'
      })

      await Twilio.conversations
        .conversations(conversationSID)
        .participants.create({ 'messagingBinding.address': `+${person1.phoneNum}` })

      await Twilio.conversations
        .conversations(conversationSID)
        .participants.create({ 'messagingBinding.address': `+${person2.phoneNum}` })

      await Twilio.conversations.conversations(conversationSID).messages.create({
        body: `Hi, Loop Bot here! ${person1.firstName} meet ${person2.firstName}! We're connecting you because${
          common.asksUser1 !== undefined
            ? ` ${person2.firstName} can help with${common.asksUser1.map(
                (ask) =>
                  `${
                    ask == 'investors' && common.asksUser1.length === 1
                      ? ` finding investors.`
                      : ask == 'investors'
                      ? ` finding investors`
                      : ask == 'cofounders'
                      ? `${
                          common.asksUser1[common.asksUser1.length - 1] === 'cofounders' &&
                          common.asksUser1.length !== 1
                            ? ' and finding a co-founder.'
                            : ' finding a co-founder'
                        }`
                      : ask == 'refer'
                      ? `${
                          common.asksUser1[common.asksUser1.length - 1] === 'refer' && common.asksUser1.length !== 1
                            ? ' and job referrals.'
                            : ' job referrals'
                        }`
                      : ask == 'hiring'
                      ? `${
                          common.asksUser1[common.asksUser1.length - 1] === 'hiring' && common.asksUser1.length !== 1
                            ? ' and hiring.'
                            : ' hiring'
                        }`
                      : ''
                  }`
              )}`
            : ''
        }${
          common.asksUser2 !== undefined
            ? ` ${person1.firstName} can help with${common.asksUser2.map(
                (ask) =>
                  `${
                    ask == 'investors' && common.asksUser1.length === 1
                      ? ` finding investors.`
                      : ask == 'investors'
                      ? ` finding investors`
                      : ask == 'cofounders'
                      ? `${
                          common.asksUser2[common.asksUser2.length - 1] === 'cofounders' &&
                          common.asksUser2.length !== 1
                            ? ' and '
                            : ' '
                        }finding a co-founder`
                      : ask == 'refer'
                      ? `${
                          common.asksUser2[common.asksUser2.length - 1] === 'refer' && common.asksUser2.length !== 1
                            ? ' and '
                            : ' '
                        }job referrals`
                      : ask == 'hiring'
                      ? `${
                          common.asksUser2[common.asksUser2.length - 1] === 'hiring' && common.asksUser2.length !== 1
                            ? ' and '
                            : ' '
                        }hiring`
                      : ''
                  }`
              )}.`
            : ''
        }${common.location !== undefined ? `You are both located in ${common.location}` : ''}${
          common.industry !== undefined && common.location !== undefined && common.role !== undefined
            ? `, operate in ${common.industry},`
            : common.industry !== undefined && common.location !== undefined && common.role === undefined
            ? ` and operate in ${common.industry}.`
            : common.industry !== undefined && common.location === undefined
            ? `You both operate in ${common.industry}`
            : ''
        }${
          common.role !== undefined && common.industry !== undefined
            ? ` and are ${common.role}s`
            : common.role !== undefined && common.industry === undefined && common.location === undefined
            ? `You are both a ${common.role}`
            : ''
        }. ${
          common.interests !== undefined
            ? `You also have a shared interest in${common.interests.map(
                (interest) =>
                  `${
                    interest === common.interests[common.interests.length - 1] &&
                    common.interests.length !== 1 &&
                    ' and'
                  } ${interest}`
              )}`
            : ''
        }. I worked hard to make this happen - I hope it'll be useful 😊`,
        author: 'Loop Bot'
      })

      await Twilio.conversations.conversations(conversationSID).remove()
    })
  }
}

singleRandBump()
