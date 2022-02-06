import { doc, getDoc, collection, query, getDocs, where } from 'firebase/firestore'
import db from '../../firebase/clientApp'

const authToken = process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID
const Twilio = require('twilio')(accountSid, authToken)

async function randomBump(req, res) {
  const q = query(collection(db, 'communities'))
  const communities = await getDocs(q)
  const communityIds = []

  communities.forEach((community) => {
    let communityData = community.data()
    if (communityData.communityId !== undefined) {
      communityIds.push(communityData.communityId)
    }
  })

  const userCommunities = []
  const uniqueCommunityIds = new Set(communityIds)

  uniqueCommunityIds.forEach(async (community) => {
    if (community.targetedMatching === 'on') {
      const q = query(collection(db, 'users'), where('communityIds', 'array-contains', community))
      const users = await getDocs(q)

      users.forEach((user) => {
        if (user.targetedBump) {
          let userData = user.data()
          let userId = user.id
          userCommunities.push([userData, userId])
        }
      })

      const matchedUsers = [] // [[user1,id],[user2,id2],{match criteria}]
      userCommunities.forEach(async (user, upperIndex) => {
        if (user[0].targetedBump === true) {
          if (matchedUsers.length === 0 || matchedUsers.filter(([a, b, c]) => b === null).length === 0) {
            // checks if array is empty or all matched up
            matchedUsers.push([user, null, {}])
          } else {
            // match based on ask/offer and industry
            matchedUsers.forEach((possible, i) => {
              let allPossiblesPushed = false
              if (possible[1] === null) {
                const possibleMatches = []
                let matched = false
                const possibleOfferMatch = possible[0][0].asks.some((x) => user[0].offers.includes(x))
                const possibleUserMatch = user[0].asks.some((x) => possible[0][0].offers.includes(x))
                const possibleIndustryMatch = possible[0][0].industry === user[0].industry
                const possibleLocationMatch = possible[0][0].location === user[0].location
                const possibleInterestsMatch = user[0].interests.some((x) => possible[0][0].interests.includes(x))
                const possibleRoleMatch = possible[0][0].role === user[0].role

                const checkMatches = [
                  possibleOfferMatch,
                  possibleUserMatch,
                  possibleIndustryMatch,
                  possibleLocationMatch,
                  possibleInterestsMatch,
                  possibleRoleMatch
                ]

                if (user[0].prevMatches === undefined || !possible[0][0].prevMatches.includes(user[1])) {
                  // checks if they haven't matched in the past

                  if ((possibleOfferMatch || possibleUserMatch) && possibleIndustryMatch) {
                    // offer/ask & industry & location and matches them
                    matchedUsers[i][1] = user
                    matched = true

                    user[0].set(
                      {
                        prevMatches:
                          user[0].prevMatches !== undefined
                            ? [...user[0].prevMatches, possible[0][1]]
                            : [possible[0][1]]
                      },
                      { merge: true }
                    ) // CHECK FIREBASE DB IF IT CHANGES
                    possible[0][0].set(
                      {
                        prevMatches:
                          possible[0][0].prevMatches !== undefined
                            ? [...possible[0][0].prevMatches, user[1]]
                            : [user[1]]
                      },
                      { merge: true }
                    ) // CHECK FIREBASE DB IF IT CHANGES
                    checkMatches.forEach((field, x) => {
                      if (field && x === 0) {
                        // if offers/asks match
                        const asksUserOne = possible[0][0].asks.filter((value) => user[0].offers.includes(value))
                        matchedUsers[i][2]['asksUser1'] = asksUserOne
                      } else if (field && x === 1) {
                        const asksUserTwo = possible[0][0].offers.filter((value) => user[0].asks.includes(value))
                        matchedUsers[i][2]['asksUser2'] = asksUserTwo
                      } else if (field && x === 2) {
                        // if industry match
                        matchedUsers[i][2]['industry'] = possible[0][0].industry
                      } else if (field && x === 3) {
                        // if location match
                        matchedUsers[i][2]['location'] = possible[0][0].location
                      } else if (field && x === 4) {
                        // if interests match
                        const interestsMatch = possible[0][0].interests.filter((value) =>
                          user[0].interests.includes(value)
                        )
                        matchedUsers[i][2]['interests'] = interestsMatch
                      } else if (field && x === 5) {
                        // if role match
                        matchedUsers[i][2]['role'] = possible[0][0].role
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
                    matchedUsers[i][1] = possibleMatches[0][1] // user was stored in the second index
                    checkMatches.forEach((field, x) => {
                      if (field && x === 0) {
                        // if offers/asks match
                        const asksUserOne = possible[0][0].asks.filter((value) => user[0].offers.includes(value))
                        possibleMatches[i][2]['asksUser1'] = asksUserOne
                      } else if (field && x === 1) {
                        const asksUserTwo = possible[0][0].offers.filter((value) => user[0].asks.includes(value))
                        possibleMatches[i][2]['asksUser2'] = asksUserTwo
                      } else if (field && x === 2) {
                        // if industry match
                        possibleMatches[i][2]['industry'] = possible[0][0].industry
                      } else if (field && x === 3) {
                        // if location match
                        possibleMatches[i][2]['location'] = possible[0][0].location
                      } else if (field && x === 4) {
                        // if interests match
                        const interestsMatch = possible[0][0].interests.filter((value) =>
                          user[0].interests.includes(value)
                        )
                        possibleMatches[i][2]['interests'] = interestsMatch
                      } else if (field && x === 5) {
                        // if role match
                        possibleMatches[i][2]['role'] = possible[0][0].role
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

      let today = new Date().getTime()
      matchedUsers.forEach(async (match) => {
        const person1 = match[0][0]
        const person2 = match[1][0]
        const common = match[2]
        let conversationSID = ''
        person1.set({ lastSent: today }, { merge: true })
        person2.set({ lastSent: today }, { merge: true })

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
  })
}

randomBump()
