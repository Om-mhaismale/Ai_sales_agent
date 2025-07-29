"""
Database migration script to add status and notes columns to existing bookings table.
Run this once to update your existing database schema.
"""

import sqlite3
import os

def migrate_database():
    db_path = "c:/PROJECTS/Ai_sales_agent/Backend/reminder-bot/bookings.db"
    
    if not os.path.exists(db_path):
        print("❌ Database file not found. Please run init_db.py first.")
        return
    
    print("🔄 Starting database migration...")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check current schema
        cursor.execute("PRAGMA table_info(bookings)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        print(f"📋 Current columns: {column_names}")
        
        # Add status column if it doesn't exist
        if 'status' not in column_names:
            cursor.execute("ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'scheduled'")
            print("✅ Added 'status' column")
        else:
            print("⏭️  'status' column already exists")
            
        # Add notes column if it doesn't exist  
        if 'notes' not in column_names:
            cursor.execute("ALTER TABLE bookings ADD COLUMN notes TEXT")
            print("✅ Added 'notes' column")
        else:
            print("⏭️  'notes' column already exists")
        
        # Update existing records to have proper status based on reminder/feedback flags
        cursor.execute("""
            UPDATE bookings 
            SET status = CASE 
                WHEN feedback_sent = 1 THEN 'completed'
                WHEN reminder_sent = 1 AND feedback_sent = 0 THEN 'confirmed' 
                ELSE 'scheduled'
            END
            WHERE status = 'scheduled' OR status IS NULL
        """)
        
        updated_rows = cursor.rowcount
        print(f"🔄 Updated {updated_rows} booking statuses")
        
        conn.commit()
        
        # Show final schema
        cursor.execute("PRAGMA table_info(bookings)")
        final_columns = cursor.fetchall()
        print("\n📋 Final schema:")
        for col in final_columns:
            print(f"  - {col[1]} ({col[2]})")
            
        # Show sample data
        cursor.execute("SELECT id, name, status, notes FROM bookings LIMIT 3")
        sample_data = cursor.fetchall()
        if sample_data:
            print("\n📊 Sample data:")
            for row in sample_data:
                print(f"  ID: {row[0]}, Name: {row[1]}, Status: {row[2]}, Notes: {row[3]}")
        
        conn.close()
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")

if __name__ == "__main__":
    migrate_database()
