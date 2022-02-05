import firebase_admin 
from firebase_admin import credentials
from firebase_admin import firestore
from decouple import config

from telegram import ReplyKeyboardMarkup, Update
from telegram.ext import (

    CallbackContext,
)

from helpers import convertTodayToJSDate

PROFILE_FIELDS = {'1 First name': 'firstName', '2 Last name': 'lastName', '3 Location': 'location', '4 Role': 'role', '5 Work': 'work', '6 Projects': 'projects', '7 Offers': 'offers'}
UPDATE_PROFILE_KEYBOARD = [['1 First name'], ['2 Last name'], ['3 Location'], ['4 Role'], ['5 Work'], ['6 Projects'], ['7 Offers']]
UPDATE_QUERIES = '^(1 First name|2 Last name|3 Location|4 Role|5 Work|6 Projects|7 Offers)$'


def sendUpdateInfoBump(updater, db) -> None:
    communities_ref = db.collection(u'communities')
    for community in communities_ref.stream():
        # start updates for this community 
        communityDict = community.reference.get().to_dict()

        # send update to each user
        if 'users' in communityDict:
            for user_id in communityDict['users']:
                user_ref = db.collection(u'users').document(user_id)
                user_data = user_ref.get().to_dict()
                if user_data and 'telegram_id' in user_data:
                    # format for projects based on if they have projects or not
                    no_projects = len(user_data['projects']) == 0
                    user_projects_1 = "aren't" if no_projects else ''
                    user_projects_2 = 'projects' if no_projects else map(lambda x: f'{x}', user_data['projects'])

                    # format for offers
                    formatted_offers = ''
                    offer_formats = {'investors': 'can intro to investors', 'cofounders': 'are searching for cofounders', 'refer': 'can refer to a job', 'hiring': 'are hiring'}
                    offers = user_data.get('offers', [])
                    for i in range(len(offers)):
                        if i == len(offers) - 1: # last in list
                            formatted_offers += ' and ' + offer_formats[offers[i]]
                        else:
                            formatted_offers += offer_formats[offers[i]] + ','

                    today = convertTodayToJSDate()
                    # user has not been upated in 3 months and user hasn't been bumped in 2 months
                    # if today - user_data['lastUpdated'] >= 7776000000 and today - user_data['lastSent'] >= 5184000000:
                    if True:
                        user_ref.update({'lastSent': today}) # TODO: merge = true?
                        updater.bot.send_message(chat_id=user_data['telegram_id'], text=f"Hey, {user_data['firstName']}! It's been a few months since you updated your information " \
                        f"for {communityDict['communityId']}: 1) {user_data['firstName']} {user_data['lastName']}, 2)  {user_data['email']}, in 3)  {user_data['location']}, "\
                        f"4) {user_data['role']} at 5) {user_data['work']}, 6) {user_projects_1} working on {user_projects_2} and you "\
                        f"7) {formatted_offers}. Want to update any fields?", reply_markup=ReplyKeyboardMarkup(UPDATE_PROFILE_KEYBOARD, one_time_keyboard=True,

         ))


def askForNewValue(update: Update, context: CallbackContext, db) -> int:
    """Gets the value that the user wants to update with."""
    profile_field = PROFILE_FIELDS[update.message.text]
    users_ref = db.collection(u'users')
    query_ref = users_ref.where(u'telegram_id', u'==', update.message.chat_id)
    docs = query_ref.stream()

    for doc in docs:
        user_ref = doc.reference
    
    context.user_data['ref'] = user_ref # Save in context so we can access throughout convo
    context.user_data['field_updating'] = profile_field # Field that's currently being updated

    existing_value = user_ref.get().to_dict()[profile_field]

    update.message.reply_text("Cool! What do you wanna update to? Currently:")
    update.message.reply_text(existing_value)

    return 0

def updateWithNewValue(update: Update, context: CallbackContext) -> int:
    """Sets the new value."""
    context.user_data['ref'].update({context.user_data['field_updating']: update.message.text})

    update.message.reply_text("Updated! Any others?", reply_markup=ReplyKeyboardMarkup(UPDATE_PROFILE_KEYBOARD, one_time_keyboard=True))

    return 1

