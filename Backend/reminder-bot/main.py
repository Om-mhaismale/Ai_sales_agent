from apscheduler.schedulers.background import BackgroundScheduler
from reminder import run_reminder_bot
from time import sleep

scheduler = BackgroundScheduler()
scheduler.add_job(run_reminder_bot, 'interval', minutes=1)
scheduler.start()

print("⏳ Reminder & Feedback bot running every minute...")

try:
    while True:
        sleep(1)
except (KeyboardInterrupt, SystemExit):
    scheduler.shutdown()
