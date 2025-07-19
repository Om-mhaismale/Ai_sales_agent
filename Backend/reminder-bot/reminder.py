from datetime import datetime, timedelta
from whatsapp import send_whatsapp_message
from email_sender import send_email
from database import SessionLocal
from models import Booking

def run_reminder_bot():
    print(f"\n🔍 Checking reminders at: {datetime.now()}")
    db = SessionLocal()
    now = datetime.now()

    reminder_start = now
    reminder_end = now + timedelta(hours=1)

    bookings = db.query(Booking).filter(Booking.reminder_sent == False).all()
    print(f"📦 Total bookings with reminder_sent=False: {len(bookings)}")
    print(f"⏳ Reminder Window: {reminder_start.strftime('%Y-%m-%d %H:%M')} to {reminder_end.strftime('%Y-%m-%d %H:%M')}")

    for b in bookings:
        try:
            booking_time = datetime.strptime(f"{b.date} {b.slot}", "%Y-%m-%d %H:%M")
            print(f"\n🔹 Booking ID={b.id}, Name={b.name}, BookingTime={booking_time}")

            if reminder_start <= booking_time < reminder_end:
                print("✅ Inside reminder window. Sending reminder...")
                msg = f"⏰ Hello {b.name}, reminder for your appointment at {b.slot} on {b.date}."
                send_whatsapp_message(b.phone, msg)
                if b.email:
                    send_email(b.email, "⏰ Appointment Reminder", msg)
                b.reminder_sent = True
                db.commit()
                print(f"📨 Reminder sent to {b.phone}")
            else:
                print("⛔ Outside reminder window.")

        except Exception as e:
            print(f"❌ Error in processing booking ID={b.id}: {e}")

    db.close()



def run_feedback_bot():
    print(f"\n🕒 Checking feedbacks at: {datetime.now()}")
    db = SessionLocal()
    now = datetime.now()
    window_start = now - timedelta(minutes=2)
    window_end = now - timedelta(minutes=1)

    bookings = db.query(Booking).filter(Booking.feedback_sent == False).all()

    for b in bookings:
        try:
            booking_time = datetime.strptime(f"{b.date} {b.slot}", "%Y-%m-%d %H:%M")
            print(f"🧾 Booking: {b.name}, Time: {booking_time}")

            if window_start <= booking_time < window_end:
                msg = f"📝 Hi {b.name}, we hope your appointment at {b.slot} on {b.date} went well. Please share your feedback!"
                send_whatsapp_message(b.phone, msg)
                if b.email:
                    send_email(b.email, "📝 Appointment Feedback", msg)
                b.feedback_sent = True
                db.commit()
                print(f"📩 Feedback sent to {b.phone}")
            else:
                print(f"⏭ Not in feedback window for ID={b.id}")
        except Exception as e:
            print(f"❌ Feedback Error: {e}")
    db.close()