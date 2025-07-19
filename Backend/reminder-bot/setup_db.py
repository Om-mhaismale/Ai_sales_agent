import sqlite3
from datetime import datetime, timedelta

conn = sqlite3.connect('bookings.db')
cursor = conn.cursor()

# 🔥 Drop the table if it already exists
cursor.execute("DROP TABLE IF EXISTS bookings")

# ✅ Create the table fresh with correct columns
cursor.execute('''
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    booking_time TEXT NOT NULL
)
''')

# Insert some sample bookings 5–30 mins from now
now = datetime.now()
bookings = [
    ('Kashish', '9999999999', 'kashish@example.com', (now + timedelta(minutes=5)).isoformat()),
    ('Sneha', '8888888888', 'sneha@example.com', (now + timedelta(minutes=20)).isoformat()),
]

cursor.executemany("INSERT INTO bookings (name, phone, email, booking_time) VALUES (?, ?, ?, ?)", bookings)
conn.commit()
conn.close()
