import sqlite3

conn = sqlite3.connect("bookings.db")
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    email TEXT,
    date TEXT,
    slot TEXT,
    reminder_sent INTEGER DEFAULT 0,
    feedback_sent INTEGER DEFAULT 0
)
''')

conn.commit()
conn.close()

print("✅ New bookings.db created with fresh schema.")
