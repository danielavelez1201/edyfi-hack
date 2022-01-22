import datetime


def convertTodayToJSDate():
    """Convert today to milliseconds since Jan 1, 1970 for compatibility w/ JS date"""
    date_1 = datetime.datetime.strptime('01/01/1970 00:00:00.00',  '%d/%m/%Y %H:%M:%S.%f')
    date_2 = datetime.datetime.now()
    diff = date_2 - date_1
    diff_in_milli_secs = diff.total_seconds() * 1000
    return diff_in_milli_secs