import logging
import firebase_admin 
from firebase_admin import credentials
from firebase_admin import firestore
from decouple import config
from pytz import timezone
import pytz

from telegram.ext import (
    Updater,
    CommandHandler,
    MessageHandler,
    Filters,
    ConversationHandler,
)
from public.telegram.community_updates import sendCommunityUpdate
from public.telegram.intro import cancel, phone, start

from public.telegram.update_profile import UPDATE_QUERIES, askForNewValue, sendUpdateInfoBump, updateWithNewValue

# initializations 
cred = credentials.Certificate('firebase-key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

api_key = config('TELEGRAM_BOT_API_KEY')

def main() -> None:
    """Run the bot."""

    # Create the Updater and pass it your bot's token.
    updater = Updater(token=api_key)

    sendCommunityUpdate(updater)
    sendUpdateInfoBump(updater)

    j = updater.job_queue
    utc = pytz.utc
    utc.zone

    #job_daily = j.run_daily(communityUpdate, days=(0, 1, 2, 3, 4, 5, 6), time=datetime.time(hour=10, minute=25, second=00, tzinfo=eastern))

    # Get the dispatcher to register handlers
    dispatcher = updater.dispatcher

    # Add conversation handler with states
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            0: [MessageHandler(Filters.regex('[0-9]+'), phone)],
        },
        fallbacks=[CommandHandler('cancel', cancel)],
    )

    # Update info conversation handler
    conv_handler = ConversationHandler(
        entry_points=[MessageHandler(Filters.regex(UPDATE_QUERIES), askForNewValue)],
        states={
            0: [MessageHandler(Filters.all, callback= updateWithNewValue)],
            1: [MessageHandler(Filters.regex(UPDATE_QUERIES), askForNewValue)],
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

