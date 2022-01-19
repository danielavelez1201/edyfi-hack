import logging
import firebase_admin 
from firebase_admin import credentials
from firebase_admin import firestore
from decouple import config
from pytz import timezone

from telegram import ReplyKeyboardRemove, Update
from telegram.ext import (
    ConversationHandler,
    CallbackContext,
)

# initializations 
cred = credentials.Certificate('firebase-key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

def start(update: Update, context: CallbackContext) -> int:
    """Starts the conversation and gives info about commands."""
    reply_keyboard = [['update']]

    update.message.reply_text(
        'Hey! This is the Loop chatbot, here to help you stay in touch with your communities. (https://keeploop.io/) \n\n'
        "If you'd like to update your profile info, just send over 'update'. \n"
        "We'll also send weekly community nudges with random updates about your community peers and what they're up to! \n\n"
        "Just confirm the phone number on your Loop profile (no symbols, just numbers) and we're good to go!",
    )

    return 0

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
