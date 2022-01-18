import logging
import os
import random
import firebase_admin 
from firebase_admin import credentials
from firebase_admin import firestore
from decouple import config
import datetime
from pytz import timezone
import pytz

from telegram import ReplyKeyboardMarkup, ReplyKeyboardRemove, Update
from telegram.ext import (
    Updater,
    CommandHandler,
    MessageHandler,
    Filters,
    ConversationHandler,
    CallbackContext,
)

# initializations 
cred = credentials.Certificate('firebase-key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

emp_ref = db.collection('communities')
print("EMP REF", emp_ref)
docs = emp_ref.stream()
for doc in docs:
    print('{} => {} '.format(doc.id, doc.to_dict()))

print(os.environ)

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)


PHONE, PHOTO, LOCATION, BIO = range(4)

def start(update: Update, context: CallbackContext) -> int:
    """Starts the conversation and gives info about commands."""
    reply_keyboard = [['update']]

    update.message.reply_text(
        'Hey! This is the Loop chatbot, here to help you stay in touch with your communities. (https://keeploop.io/) \n\n'
        "If you'd like to update your profile info, just send over 'update'. \n"
        "We'll also send weekly community nudges with random updates about your community peers and what they're up to! \n\n"
        "Just confirm the phone number on your Loop profile (no symbols, just numbers) and we're good to go!",
        # reply_markup=ReplyKeyboardMarkup(
        #     reply_keyboard, one_time_keyboard=True, input_field_placeholder='phone number'
        # ),
    )

    return PHONE


def phone(update: Update, context: CallbackContext) -> int:
    """Stores the phone number."""
    user = update.message.from_user

    # get user by phone num and add telegram id 
    users_ref = db.collection(u'users')
    query_ref = users_ref.where(u'phone', u'==', u'{}'.format(update.message.text))
    docs = query_ref.stream()
    for doc in docs:
        doc.reference.update({"telegram_id": update.message.chat_id})
        user_data = doc.reference.get().to_dict()
        profile_id = doc.id

    # get communities that user is a part of 
    communities_ref = db.collection(u'communities')
    query_ref = communities_ref.where(u'users', u'array_contains', u'{}'.format(profile_id))
    docs = query_ref.stream()
    user_communities = []
    for doc in docs:
        user_communities.append(doc.reference.get().to_dict()['communityId'])

    if user_communities == []:
        # in no communities 
        message = "Looks like you haven't joined any communities yet! Once a community admin onboards you, come back and let me know." 
        "Or, create a community of your own! (https://keeploop.io/)"
    elif len(user_communities) == 1:
        message = 'Thanks ' + '{}'.format(user_data['firstName']) + "! We'll be sending you updates for " + '{}'.format(user_communities[0]) + '.'
    else:
        message = 'Thanks ' + '{}'.format(user_data['firstName']) + "! We'll be sending you updates for your communities."

    update.message.reply_text(message)

    return ConversationHandler.END



def cancel(update: Update, context: CallbackContext) -> int:
    """Cancels and ends the conversation."""
    user = update.message.from_user
    logger.info("User %s canceled the conversation.", user.first_name)
    update.message.reply_text(
        'Bye!', reply_markup=ReplyKeyboardRemove()
    )

    return ConversationHandler.END

api_key = config('TELEGRAM_BOT_API_KEY')

def sendUpdateInfoBump(updater) -> None:
    communities_ref = db.collection(u'communities')
    for community in communities_ref.stream():
        # start updates for this community 
        communityDict = community.reference.get().to_dict()

        # send update to each user
        if 'users' in communityDict:
            for user_id in communityDict['users']:
                user_ref = db.collection(u'users').document(user_id)
                user_data = user_ref.get().to_dict()

                # format for projects based on if they have projects or not
                no_projects = len(user_data['projects']) == 0
                user_projects_1 = "aren't" if no_projects else ''
                user_projects_2 = 'projects' if no_projects else ''
                user_projects_3 = '' if no_projects else map(lambda x: f'{x}', user_data['projects'])

                # format for offers
                formatted_offers = ''
                offer_formats = {'investors': 'can intro to investors', 'cofounders': 'are searching for cofounders', 'refer': 'can refer to a job', 'hiring': 'are hiring'}
                offers = user_data['offers']
                for i in range(len(offers)):
                    if i == len(offers) - 1: # last in list
                        formatted_offers += 'and ' + offer_formats[offers[i]]
                    else:
                        formatted_offers += offer_formats[offers[i]] + ','

                if 'telegram_id' in user_data:
                    if user_data['lastUpdated'] <= datetime.date.today - 7889400000 and user_data['lastSent'] <= datetime.date.today - 5259600000:
                        user_ref.update({'lastSent': datetime.date.today}) # TODO: merge = true?
                        updater.bot.send_message(chat_id=user_data['telegram_id'], text=f"Hey, {user_data['firstName']}! It's been a few months since you updated your information \
                        for {communityDict['communityId']}: 1) {user_data['firstName']}  {user_data['lastName']}, 2)  {user_data['email']}, in 3)  {user_data['location']}, \
                        4) {user_data['role']} at 5) {user_data['work']}, 6) {user_projects_1} working on {user_projects_2} 'projects' {user_projects_3} and you \
                        7) {formatted_offers}. Want to update any fields (yes/no)?" )


def updateInfo(update: Update, context: CallbackContext) -> int:
    """Starts update info flow."""

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
    print(user_projects)
    project_i = random.randint(0, len(user_projects) - 1) # randomly pick from user's projects
    project_update = {'name': projects[random_i]['name'], 'project': user_projects[project_i]} if include_project_update else None

    return formatUpdate(communityId, location_update, project_update)


def communityUpdate(context) -> None:
    """Send community update."""
    return

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


def main() -> None:
    """Run the bot."""

    # Create the Updater and pass it your bot's token.
    updater = Updater(token=api_key)

    sendCommunityUpdate(updater)
    sendUpdateInfoBump(updater)

    j = updater.job_queue
    utc = pytz.utc
    utc.zone
    eastern = timezone('US/Eastern')

    job_daily = j.run_daily(communityUpdate, days=(0, 1, 2, 3, 4, 5, 6), time=datetime.time(hour=10, minute=25, second=00, tzinfo=eastern))

    # Get the dispatcher to register handlers
    dispatcher = updater.dispatcher

    # Add conversation handler with states
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            PHONE: [MessageHandler(Filters.regex('[0-9]+'), phone)],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
    )

    # Update info conversation handler
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('update', updateInfo)],
        states={

        }
    )

    dispatcher.add_handler(conv_handler)

    # Start the Bot
    updater.start_polling()

    # Run the bot until you press Ctrl-C or the process receives SIGINT,
    # SIGTERM or SIGABRT. This should be used most of the time, since
    # start_polling() is non-blocking and will stop the bot gracefully.
    updater.idle()


if __name__ == '__main__':
    main()

