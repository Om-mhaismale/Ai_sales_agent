from apscheduler.schedulers.background import BackgroundScheduler
from reminder import run_reminder_bot, run_feedback_bot
import time

print("\n📡 Bot running... Press Ctrl+C to stop.")

scheduler = BackgroundScheduler()
scheduler.add_job(run_reminder_bot, 'interval', minutes=1)
scheduler.add_job(run_feedback_bot, 'interval', minutes=1)
scheduler.start()

try:
    while True:
        time.sleep(5)
except KeyboardInterrupt:
    print("\n🛑 Bot stopped.")
    scheduler.shutdown()
