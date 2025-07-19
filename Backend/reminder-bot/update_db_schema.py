import sqlite3

conn = sqlite3.connect('bookings.db')
cursor = conn.cursor()

cursor.execute("ALTER TABLE bookings ADD COLUMN reminder_sent INTEGER DEFAULT 0")
cursor.execute("ALTER TABLE bookings ADD COLUMN feedback_sent INTEGER DEFAULT 0")

conn.commit()
conn.close()
