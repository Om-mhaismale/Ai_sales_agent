import sqlite3

conn = sqlite3.connect('bookings.db')
cursor = conn.cursor()

cursor.execute("""
    SELECT id, name, phone, booking_time, reminder_sent
    FROM bookings
""")
bookings = cursor.fetchall()

print("📋 All Bookings:")
for b in bookings:
    print(b)

conn.close()
