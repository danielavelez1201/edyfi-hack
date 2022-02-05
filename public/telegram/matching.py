
from operator import truediv


def formAndSendMatches(users):
    
    def allMatched(matchedList):
        return not any(lambda x: x[1] == None, matchedList) # every user has a match

    def elementsInCommon(list1, list2):
        # number of elements in common
        return set(list1.asks).intersection(list2.offers)

    matchedUsers = []
    for user, userId in users: # [[user1,id],[user2,id2],{match criteria}]
        if user.targetedBump:
            if allMatched(matchedUsers):
                matchedUsers.append([user, None, {}])
            else:
                for otherUserData in matchedUsers:
                    otherUser = otherUserData[0]
                    possibleOfferMatch = len(elementsInCommon(otherUser.asks, user.offers)) > 0 
                    possibleUserMatch = len(elementsInCommon(otherUser.offers, user.asks)) > 0 
                    possibleIndustryMatch = otherUser.industry == user.industry
                    possibleLocationMatch = otherUser.location == user.location
                    possibleInterestsMatch = len(elementsInCommon(otherUser.interests, user.interests)) > 0
                    possibleRoleMatch = otherUser.role == user.role

                    if (not user.prevMatches or userId not in otherUser.prevMatches):
                        if ((possibleOfferMatch or possibleUserMatch) and possibleIndustryMatch):
                            otherUserData[1] = user
                            matched = True
                            
                            if user.prevMatches:
                                user.update({'prevMatches': user.prevMatches.extend(otherUser)})
                            else:
                                user.update({'prevMatches': [otherUser]})
                            
                            if otherUser.prevMatches:
                                otherUser.update({'prevMatches': otherUser.prevMatches.extend(user)})
                            else:
                                otherUser.update({'prevMatches': [user]})

                    if possibleOfferMatch:
                        otherUserData[2]['asksUser1'] = elementsInCommon(otherUser.asks, user.offers)
                    if possibleOfferMatch:
                        otherUserData[2]['asksUser2'] = elementsInCommon(otherUser.offers, user.asks)
                    if possibleIndustryMatch:
                        otherUserData[2]['industry'] = otherUser.industry
                    if possibleLocationMatch:
                        otherUserData[2]['location'] = otherUser.location
                    if possibleInterestsMatch:
                        otherUserData[2]['interests'] = elementsInCommon(otherUser.interests, user.interests)
                    if possibleRoleMatch:
                        otherUserData[2]['role'] = otherUser.role

