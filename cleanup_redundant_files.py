"""
Script to remove redundant files and streamline the AI Sales Agent project.
This will keep only the essential files for the backend.
"""
import os
import shutil

# Files to REMOVE (redundant/debugging)
redundant_files = [
    "Backend/reminder-bot/check_bookings.py",
    "Backend/reminder-bot/check_schema.py", 
    "Backend/reminder-bot/setup_db.py",
    "Backend/reminder-bot/update_db_schema.py",
    "Backend/reminder-bot/repair_db.py",
    "Backend/reminder-bot/view_bookings.py",
    "Backend/reminder-bot/main.py",
    "Backend/reminder-bot/run_bot.py", 
    "Backend/reminder-bot/run_feedback_bot.py",
    "Backend/reminder-bot/test_whatsapp.py",
    # Backup databases
    "Backend/reminder-bot/bookings_backup.db",
    "Backend/reminder-bot/bookings_corrupted_backup.db"
]

# Essential files to KEEP:
essential_files = [
    "Backend/reminder-bot/app.py",           # Main Flask API
    "Backend/reminder-bot/database.py",     # Database configuration
    "Backend/reminder-bot/models.py",       # Database models  
    "Backend/reminder-bot/reminder.py",     # Reminder/feedback logic
    "Backend/reminder-bot/email_sender.py", # Email functionality
    "Backend/reminder-bot/whatsapp.py",     # WhatsApp functionality
    "Backend/reminder-bot/init_db.py",      # Database initialization
    "Backend/reminder-bot/bookings.db"      # Main database
]

def cleanup_project():
    base_path = "c:/PROJECTS/Ai_sales_agent"
    
    print("🧹 Starting project cleanup...")
    print(f"📂 Working directory: {base_path}")
    
    removed_count = 0
    
    # Remove redundant files
    for file_path in redundant_files:
        full_path = os.path.join(base_path, file_path)
        if os.path.exists(full_path):
            try:
                os.remove(full_path)
                print(f"❌ Removed: {file_path}")
                removed_count += 1
            except Exception as e:
                print(f"⚠️  Failed to remove {file_path}: {e}")
        else:
            print(f"⏭️  Already missing: {file_path}")
    
    print(f"\n✅ Cleanup completed!")
    print(f"📊 Removed {removed_count} redundant files")
    print(f"📁 Essential files preserved: {len(essential_files)}")
    
    print("\n📋 Essential files that should remain:")
    for file_path in essential_files:
        full_path = os.path.join(base_path, file_path)
        if os.path.exists(full_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ MISSING: {file_path}")

if __name__ == "__main__":
    cleanup_project()
