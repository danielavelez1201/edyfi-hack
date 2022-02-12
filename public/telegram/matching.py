
from operator import truediv

def sendCommunityMatches(updater, db, logger) -> None:
    logger.info("starting community matches")
    communities_ref = db.collection(u'communities')
    for community in communities_ref.stream():
        # start updates for this community 
        communityDict = community.reference.get().to_dict()
        telegram_users = getCommunityTelegramUsers(communityDict, db, logger)

        matches = formMatches(logger, telegram_users)
        sendMatches(updater, matches, logger)

def getCommunityTelegramUsers(communityDict, db, logger):
    """Get community telegram users, locations, and projects."""

    telegram_users = [] # [{chat_id: chat_id, name: name, location: location, last_updated: last_updated}]
    
    # loop through community users and gather locations, projects, and telegram info
    if 'users' in communityDict:
        for user_id in communityDict['users']:

            user_doc = db.collection(u'users').document(user_id)
            user_data = user_doc.get().to_dict()
            if user_doc: 
                # add to telegram info and name / location references
                if 'telegram_id' in user_data: 
                    chat_id = user_data['telegram_id']
                    if chat_id:
                        telegram_users.append([user_doc, user_id])

    return telegram_users


shorthand_to_normal = {'investors': 'finding investors', 'cofounders': 'finding a co-founder', 'refer': 'job referrals', 'hiring': 'hiring'}

def formatMatch(user1, user2, common_dict, asks_for_user_1 = True):

    def format_asks(asks):
        formatted_asks = ""
        if len(asks) == 1:
            formatted_asks += shorthand_to_normal[asks[0]]
        else:
            i = 0
            for ask in asks:
                if i == len(asks) - 1:
                    formatted_asks += 'and ' + shorthand_to_normal[ask] 
                else:
                    formatted_asks += shorthand_to_normal[ask] + ', '
                i += 1
        return formatted_asks

    message = f"Hi {user1['firstName']}, Loop Bot here! We'd love for you to meet {user2['firstName']}. "
    
    if asks_for_user_1:
        if 'asksUser1' in common_dict:
            message += f"We're connecting you because {user2['firstName']} can help with {format_asks(common_dict['asksUser1'])}. "
    else:
        if 'asksUser2' in common_dict:
            message += f"We're connecting you because {user2['firstName']} can help with {format_asks(common_dict['asksUser2'])}. "
    
    industry_match = 'industry' in common_dict
    match_texts = []
    if industry_match:
        match_texts.append(f"both operate in {common_dict['industry']}")

    location_match = 'location' in common_dict
    if location_match:
        match_texts.append(f"are both located in {common_dict['location']}")

    role_match = 'role' in common_dict
    if role_match:
        match_texts.append(f"are both a {common_dict['role']}")

    for i in range(len(match_texts)):
        if i == 0:
            message += 'You ' + match_texts[0]
            if len(match_texts) == 1:
                message += '. '
        elif i == len(match_texts) - 1: 
            message += 'and ' + match_texts[2] + '. '
        else:
            message += ', ' + match_texts[1] + ','

    message += "I worked hard to make this happen - I hope it'll be useful! :)"
    return message

def sendMatches(updater, match_array, logger):

    logger.info(match_array)

    for user_doc_1, user_doc_2, common_dict in match_array:

        telegram_id_1 = user_doc_1.get().to_dict()['telegram_id']
        telegram_id_2 = user_doc_2.get().to_dict()['telegram_id']

        try:
            updater.bot.send_message(chat_id=telegram_id_1, text=formatMatch(user_doc_1.get().to_dict(), user_doc_2.get().to_dict(), common_dict, True))
        except:
            logger.error(f'telegram id {telegram_id_1} not found')

        try:
            updater.bot.send_message(chat_id=telegram_id_2, text=formatMatch(user_doc_2.get().to_dict(), user_doc_1.get().to_dict(), common_dict, False))
        except:
            logger.error(f'telegram id {telegram_id_2} not found')

def formMatches(logger, user_docs):
    
    def allMatched(matchedList):
        return not any([x[1] == None for x in matchedList]) # every user has a match

    def elementsInCommon(list1, list2):
        # number of elements in common
        logger.info(set(list1).intersection(list2))
        return set(list1).intersection(list2)

    matchedUsers = []
    for user_doc, userId in user_docs: # [[user1,id],[user2,id2],{match criteria}]
        user = user_doc.get().to_dict()
        if user['targetedBump']:
            if allMatched(matchedUsers):
                matchedUsers.append([user_doc, None, {}])
            else:
                for otherUserData in matchedUsers:
                    
                    other_user_doc = otherUserData[0]
                    otherUser = other_user_doc.get().to_dict()
                    possibleOfferMatch = len(elementsInCommon(otherUser['asks'], user['offers'])) > 0 
                    possibleUserMatch = len(elementsInCommon(otherUser['offers'], user['asks'])) > 0 
                    possibleIndustryMatch = otherUser['industry'] == user['industry']
                    possibleLocationMatch = otherUser['location'] == user['location']
                    possibleInterestsMatch = len(elementsInCommon(otherUser['interests'], user['interests'])) > 0
                    possibleRoleMatch = otherUser['role'] == user['role']

                    #if (not user['prevMatches'] or userId not in otherUser['prevMatches'] ):
                    if ((possibleOfferMatch or possibleUserMatch) and possibleIndustryMatch):
                        otherUserData[1] = user_doc
                        matched = True
                        
                        if user['prevMatches']:
                            user_doc.update({'prevMatches': user['prevMatches'].extend(other_user_doc.id)})
                        else:
                            user_doc.update({'prevMatches': [other_user_doc.id]})
                        
                        if otherUser['prevMatches']:
                            other_user_doc.update({'prevMatches': otherUser['prevMatches'].extend(user_doc.id)})
                        else:
                            other_user_doc.update({'prevMatches': [user_doc.id]})

                    if possibleOfferMatch:
                        otherUserData[2]['asksUser1'] = elementsInCommon(otherUser['asks'], user['offers'])
                    if possibleOfferMatch:
                        otherUserData[2]['asksUser2'] = elementsInCommon(otherUser['offers'], user['asks'])
                    if possibleIndustryMatch:
                        otherUserData[2]['industry'] = otherUser['industry']
                    if possibleLocationMatch:
                        otherUserData[2]['location'] = otherUser['location']
                    if possibleInterestsMatch:
                        otherUserData[2]['interests'] = elementsInCommon(otherUser['industry'], user['industry'])
                    if possibleRoleMatch:
                        otherUserData[2]['role'] = otherUser['role']

        
    logger.info(matchedUsers)
    return matchedUsers