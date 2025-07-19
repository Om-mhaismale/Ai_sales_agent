from datetime import datetime, timedelta
import sqlite3

from whatsapp import send_whatsapp_message


def run_feedback_bot():
    conn = sqlite3.connect('bookings.db')
    cursor = conn.cursor()

    now = datetime.now()
    feedback_window_start = now - timedelta(minutes=60)  # appointments that ended up to 60 mins ago
    feedback_window_end = now - timedelta(minutes=15)    # but not too recent

    cursor.execute("""
        SELECT id, name, phone, date, slot, feedback_sent
        FROM bookings
        WHERE feedback_sent = 0
    """)

    bookings = cursor.fetchall()

    for booking in bookings:
        id_, name, phone, date_str, slot_str, sent = booking

        # Combine date and slot into datetime
        appointment_time = datetime.strptime(f"{date_str} {slot_str}", "%Y-%m-%d %H:%M")
        if feedback_window_start <= appointment_time <= feedback_window_end:
            message = f"📝 Hi {name}, hope your appointment at {slot_str} on {date_str} went well! We'd love your feedback. How was your experience?"
            print(f"Sending feedback to {phone}: {message}")
            send_whatsapp_message(phone, message)

            cursor.execute("UPDATE bookings SET feedback_sent = 1 WHERE id = ?", (id_,))
            conn.commit()

    conn.close()
