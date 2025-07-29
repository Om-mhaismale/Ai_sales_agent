# AI Sales Agent - Streamlined Project

## 📁 Project Structure (After Cleanup)

```
Ai_sales_agent/
├── README.md
├── bk_venv/                    # Python virtual environment
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── reminder.tsx    # Main booking management interface
│   │   │   ├── sidebar.tsx     # Navigation sidebar
│   │   │   └── ...
│   │   └── ...
│   ├── package.json
│   └── ...
└── Backend/
    └── reminder-bot/           # Python Flask backend
        ├── app.py             # ✅ Main Flask API server
        ├── database.py        # ✅ Database configuration
        ├── models.py          # ✅ SQLAlchemy models
        ├── reminder.py        # ✅ Reminder & feedback logic
        ├── email_sender.py    # ✅ Email functionality
        ├── whatsapp.py        # ✅ WhatsApp integration
        ├── init_db.py         # ✅ Database initialization
        ├── bookings.db        # ✅ SQLite database
        └── migrate_db.py      # Database migration script
```

## 🧹 Files Removed (Redundant/Debugging)

- ❌ `check_bookings.py` - Debug script
- ❌ `check_schema.py` - Debug script  
- ❌ `setup_db.py` - Outdated setup
- ❌ `update_db_schema.py` - One-time migration
- ❌ `repair_db.py` - One-time fix
- ❌ `view_bookings.py` - Debug script
- ❌ `main.py` - Duplicate bot runner
- ❌ `run_bot.py` - Duplicate bot runner
- ❌ `run_feedback_bot.py` - Standalone version
- ❌ `test_whatsapp.py` - Test script
- ❌ `bookings_backup.db` - Backup files

## 🚀 How to Run

### 1. Backend Setup
```bash
# Navigate to project root
cd c:\PROJECTS\Ai_sales_agent

# Activate virtual environment
.\bk_venv\Scripts\activate

# Install dependencies (if needed)
pip install flask flask-cors apscheduler sqlalchemy requests

# Run the backend
cd Backend\reminder-bot
python app.py
```

### 2. Frontend Setup
```bash
# Navigate to frontend
cd c:\PROJECTS\Ai_sales_agent\frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## 📊 API Endpoints

### Backend API (Port 5000)
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/<id>` - Update booking (cancellation, etc.)
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `GET /api/health` - Health check

## 🏗️ Architecture

### Backend Features:
- **Flask API** - RESTful endpoints for booking management
- **SQLAlchemy ORM** - Database models and operations  
- **Background Scheduler** - Automatic reminder & feedback sending
- **WhatsApp Integration** - UltraMsg API for messaging
- **Email Integration** - SMTP email sending
- **Admin Authentication** - Simple session-based auth

### Frontend Features:
- **React + TypeScript** - Modern web interface
- **Tailwind CSS** - Utility-first styling
- **Tabbed Interface** - Organized booking views (All, Today, Upcoming, Completed, Cancelled)
- **Search & Pagination** - Efficient data browsing
- **Responsive Design** - Works on all screen sizes
- **Real-time Updates** - API integration with backend

## 📈 Key Improvements Made

1. **Removed 12 redundant files** - Streamlined codebase
2. **Added missing API endpoints** - PUT endpoint for booking updates
3. **Enhanced database schema** - Added status and notes columns
4. **Automated status management** - Based on reminder/feedback flags
5. **Interactive cancellation** - Modal for booking cancellation with reasons
6. **Comprehensive error handling** - Better user experience
7. **Optimized performance** - Memoized components and callbacks

## 🔧 Configuration

### Backend Configuration
- **Database**: SQLite (`bookings.db`)
- **Email**: Gmail SMTP (configured in `email_sender.py`)
- **WhatsApp**: UltraMsg API (configured in `whatsapp.py`)
- **Admin Credentials**: username: `admin`, password: `password`

### Frontend Configuration
- **API Base URL**: `http://localhost:5000/api`
- **Development Server**: Vite (typically port 5173)

## 🛠️ Development

### Database Migrations
```bash
# Run migration to add status/notes columns
python migrate_db.py
```

### Adding New Features
1. **Backend**: Add routes in `app.py`, models in `models.py`
2. **Frontend**: Add components in `src/components/`

## 📝 Notes

- The project now has only **essential files** - no redundancy
- All debugging/testing scripts have been removed
- Database schema updated with status and notes fields
- API fully supports the frontend requirements
- Background jobs (reminders/feedback) run automatically

## 🔒 Security Considerations

- Change default admin credentials for production
- Add proper environment variables for sensitive data
- Implement proper authentication/authorization
- Add input validation and sanitization
