import sqlite3

conn = sqlite3.connect('bookings.db')
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(bookings)")
columns = cursor.fetchall()

for col in columns:
    print(col)

conn.close()
