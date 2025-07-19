import sqlite3
import os

# Step 1: Backup corrupted DB
if os.path.exists("bookings.db"):
    os.rename("bookings.db", "bookings_corrupted_backup.db")
    print("✅ Backed up original DB as bookings_corrupted_backup.db")

# Step 2: Connect to backup DB and read data
old_conn = sqlite3.connect("bookings_corrupted_backup.db")
old_cursor = old_conn.cursor()

# Step 3: Create new clean DB
new_conn = sqlite3.connect("bookings.db")
new_cursor = new_conn.cursor()

# Step 4: Create fresh table with correct schema
new_cursor.execute('''
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

# Step 5: Read data from old DB (handle errors safely)
try:
    old_cursor.execute("SELECT id, name, phone, email, date, slot FROM bookings")
    rows = old_cursor.fetchall()

    for row in rows:
        new_cursor.execute("""
            INSERT INTO bookings (id, name, phone, email, date, slot)
            VALUES (?, ?, ?, ?, ?, ?)
        """, row)

    new_conn.commit()
    print(f"✅ Migrated {len(rows)} records successfully.")
except Exception as e:
    print("❌ Could not read from corrupted DB:", e)

# Close connections
old_conn.close()
new_conn.close()
