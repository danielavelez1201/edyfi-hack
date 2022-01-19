import random
import firebase_admin 
from firebase_admin import credentials
from firebase_admin import firestore
from decouple import config

# initializations 
cred = credentials.Certificate('firebase-key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

def getCommunityInfo(communityDict):
    """Get community telegram users, locations, and projects."""

    telegram_users = [] # [{chat_id: chat_id, name: name, location: location, last_updated: last_updated}]
    locations = dict() # {location: [names]}
    projects = [] # [{name: name, project: project},]
    
    # loop through community users and gather locations, projects, and telegram info
    if 'users' in communityDict:
        for user_id in communityDict['users']:

            doc_dict = db.collection(u'users').document(user_id).get().to_dict()
            if doc_dict: 
                user_full_name = doc_dict['firstName'] + ' ' + doc_dict['lastName']
                user_location = doc_dict['location'].lower()
                user_last_updated = doc_dict['lastUpdated']

                # add to locations grouping
                locations.setdefault(user_location, []).append(user_full_name)

                # add to project list
                if 'projects' in doc_dict and len(doc_dict['projects']) > 0:
                    projects.append({'name': user_full_name, 'projects': doc_dict['projects']})

                # add to telegram info and name / location references
                if 'telegram_id' in doc_dict: 
                    chat_id = doc_dict['telegram_id']
                    if chat_id:
                        telegram_users.append({'chat_id': chat_id, 'name': user_full_name, 'location': user_location, 'last_updated': user_last_updated})

    return {'telegram_users': telegram_users, 'locations': locations, 'projects': projects}

def getCommunityUpdateForUser(user, communityInfo, communityId):
    """Create community update to send to a user."""

    locations = communityInfo['locations']
    projects = communityInfo['projects']

    nearby_users = list(filter(lambda x: x != user['name'], locations[user['location']])) # get other users in same location
            
    # LOCATION UPDATE
    include_location_update = True
    if (len(nearby_users) > 0):
        if (len(nearby_users) < 4): # if there are few nearby users, we only want to include a location update sometimes
            include_location_update = False
            if (random.randint(0, 3) < len(nearby_users)): # chance that update is included is proportional to # of nearby users
                include_location_update = True

        random_i = random.randint(0, len(nearby_users) - 1) # randomly pick user index
        nearby_user = nearby_users[random_i] 
        location_update = {'name': nearby_user, 'location': user['location']} if include_location_update else None
    else: 
        location_update = None

    # PROJECT UPDATE
    include_project_update = True
    if (len(projects) < 4): # if there are few projects, we only want to include a project update sometimes
        include_project_update = False
        if (random.randint(0, 3) < len(projects)): # chance that update is included is proportional to # of projects
            include_project_update = True
    
    random_i = random.randint(0, len(projects) - 1) # randomly pick user index
    user_projects = projects[random_i]['projects']
    project_i = random.randint(0, len(user_projects) - 1) # randomly pick from user's projects
    project_update = {'name': projects[random_i]['name'], 'project': user_projects[project_i]} if include_project_update else None

    return formatUpdate(communityId, location_update, project_update)

def formatUpdate(communityId, location_update, project_update):
    text = communityId + ' weekly nugget: '

    if not (project_update or location_update):
        return "Hey! No weekly nugget this week. Brb when there's a cool update to share!"

    if project_update:
        formatted_project_update = project_update['name'] + ' is working on a project, ' + project_update['project'] + ', check it out! '
        text += formatted_project_update
        connector = 'And, l' # if there's two updates, we want an And in between
    else:
        connector = 'L' # if it's just one, we don't need an And

    if location_update:
        formatted_location_update = connector + 'ooks like you and ' + location_update['name'] + ' are both in '  + location_update['location'].capitalize() + '.'
        text += formatted_location_update
    
    return text  


def sendCommunityUpdate(updater) -> None:
    communities_ref = db.collection(u'communities')
    for community in communities_ref.stream():
        # start updates for this community 
        communityDict = community.reference.get().to_dict()
        communityInfo = getCommunityInfo(communityDict)

        # send update to each user
        for user in communityInfo['telegram_users']:
            formatted_update = getCommunityUpdateForUser(user, communityInfo, communityDict['communityId'])
            updater.bot.send_message(chat_id=user['chat_id'], text=formatted_update)
