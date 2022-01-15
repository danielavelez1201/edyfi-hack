import logging
import os
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
print("API_KEY", api_key)

def communityUpdate(context) -> None:
    """Send community update."""
    context.bot.send_message(chat_id=1911324427, text='update!')
    communities_ref = db.collection(u'communities')
    for community in communities_ref.stream():
        for user_id in community.reference.get().to_dict()['users']:
            chat_id = db.collection(u'users').document(user_id).get().to_dict()['telegram_id']
            if chat_id:
                context.bot.send_message(chat_id=chat_id, text='update!')
        

def main() -> None:
    """Run the bot."""

    # Create the Updater and pass it your bot's token.
    updater = Updater(token=api_key)

    j = updater.job_queue
    utc = pytz.utc
    utc.zone
    eastern = timezone('US/Eastern')

    job_daily = j.run_daily(communityUpdate, days=(0, 1, 2, 3, 4, 5, 6), time=datetime.time(hour=17, minute=17, second=00, tzinfo=eastern))

    # Get the dispatcher to register handlers
    dispatcher = updater.dispatcher

    # Add conversation handler with the states GENDER, PHOTO, LOCATION and BIO
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            PHONE: [MessageHandler(Filters.regex('[0-9]+'), phone)],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
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

