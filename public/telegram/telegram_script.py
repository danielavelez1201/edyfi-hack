import logging
import firebase_admin 
from firebase_admin import credentials
from firebase_admin import firestore
from decouple import config
from pytz import timezone
import pytz
import sys
from setuptools import Command

sys.path.append('/telegram') 

from telegram.ext import (
    Updater,
    CommandHandler,
    MessageHandler,
    Filters,
    ConversationHandler,
)
from community_updates import sendCommunityUpdate
from intro import cancel, phone, start

from matching import sendCommunityMatches
from update_profile import UPDATE_QUERIES, askForNewValue, sendUpdateInfoBumps, updateWithNewValue, startUpdateInfoConvo

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

api_key = config('TELEGRAM_BOT_API_KEY')

def main() -> None:
    """Run the bot."""

    logger.info("starting")
    # initializations 
    cred = credentials.Certificate('firebase-key.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    # Create the Updater and pass it your bot's token.
    updater = Updater(token=api_key)

    #sendCommunityUpdate(updater, db, logger)
    #sendUpdateInfoBumps(updater, db, logger)
    sendCommunityMatches(updater, db, logger)

    j = updater.job_queue
    utc = pytz.utc
    utc.zone

    #job_daily = j.run_daily(communityUpdate, days=(0, 1, 2, 3, 4, 5, 6), time=datetime.time(hour=10, minute=25, second=00, tzinfo=eastern))

    # Get the dispatcher to register handlers
    dispatcher = updater.dispatcher

    # Add conversation handler with states
    intro_conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', lambda x, y: start(x, y, logger))],
        states={
            0: [MessageHandler(Filters.regex('[0-9]+'), lambda x, y : phone(x, y, db, logger))],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
    )

    dispatcher.add_handler(intro_conv_handler)

    # Start update convo 
    start_update_conv_handler = ConversationHandler(
        entry_points=[CommandHandler('update', lambda x, y: startUpdateInfoConvo(x, y, db, logger))],
        states={
            0: [MessageHandler(Filters.regex(UPDATE_QUERIES), lambda x, y: askForNewValue(x, y, db, logger))],
            1: [MessageHandler(Filters.all, callback= lambda x, y: updateWithNewValue(x, y, db, logger))],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
    )

    dispatcher.add_handler(start_update_conv_handler)

    # Update info conversation handler
    update_conv_handler = ConversationHandler(
        entry_points=[MessageHandler(Filters.regex(UPDATE_QUERIES), lambda x, y: askForNewValue(x, y, db, logger))],
        states={
            1: [MessageHandler(Filters.all, callback= lambda x, y: updateWithNewValue(x, y, db, logger))],
            0: [MessageHandler(Filters.regex(UPDATE_QUERIES), lambda x, y: askForNewValue(x, y, db, logger))],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
    )

    dispatcher.add_handler(update_conv_handler)

    # Start the Bot
    updater.start_polling()

    # Run the bot until you press Ctrl-C or the process receives SIGINT,
    # SIGTERM or SIGABRT. This should be used most of the time, since
    # start_polling() is non-blocking and will stop the bot gracefully.
    updater.idle()


if __name__ == '__main__':
    main()

