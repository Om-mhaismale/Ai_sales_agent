from flask import Flask, request, session, jsonify 
from flask_cors import CORS
from database import SessionLocal, engine
from models import Booking, Base
from apscheduler.schedulers.background import BackgroundScheduler
from reminder import run_reminder_bot, run_feedback_bot
import atexit

# Create tables
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
app.secret_key = "your-secret-key-change-in-production"
CORS(app)

# ✅ Background Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(run_reminder_bot, 'interval', minutes=1)
scheduler.add_job(run_feedback_bot, 'interval', minutes=1)
scheduler.start()

# ✅ API Routes

@app.route("/api/bookings", methods=["POST"])
def create_booking():
    """Create a new booking"""
    try:
        data = request.json
        db = SessionLocal()
        
        booking = Booking(
            name=data["name"],
            phone=data["phone"], 
            email=data.get("email", ""),
            date=data["date"],
            slot=data["slot"]
        )
        
        db.add(booking)
        db.commit()
        db.refresh(booking)
        db.close()
        
        return jsonify({"success": True, "message": "Booking created successfully", "booking_id": booking.id})
    except Exception as e:
        return jsonify({"success": False, "message": f"Error creating booking: {str(e)}"}), 500

@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    """Get all bookings"""
    try:
        db = SessionLocal()
        bookings = db.query(Booking).all()
        
        bookings_list = []
        for b in bookings:
            bookings_list.append({
                "id": b.id,
                "name": b.name,
                "phone": b.phone,
                "email": b.email or "",
                "date": b.date,
                "slot": b.slot,
                "reminder_sent": b.reminder_sent,
                "feedback_sent": b.feedback_sent,
                "notes": getattr(b, 'notes', None)  # Handle missing notes field gracefully
            })
        
        db.close()
        return jsonify(bookings_list)
    except Exception as e:
        return jsonify({"success": False, "message": f"Error fetching bookings: {str(e)}"}), 500

@app.route("/api/bookings/<int:booking_id>", methods=["PUT"])
def update_booking(booking_id):
    """Update a booking (for cancellation, status changes, etc.)"""
    try:
        data = request.json
        db = SessionLocal()
        
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            db.close()
            return jsonify({"success": False, "message": "Booking not found"}), 404
        
        # Update fields that are provided
        if "status" in data:
            # Note: Since the current model doesn't have status/notes fields,
            # you might need to add them to the model or handle this differently
            pass  # Will need model update
            
        if "notes" in data:
            # Will need model update
            pass
            
        # For now, we can update basic fields
        if "name" in data:
            booking.name = data["name"]
        if "phone" in data:
            booking.phone = data["phone"]
        if "email" in data:
            booking.email = data["email"]
        if "date" in data:
            booking.date = data["date"]
        if "slot" in data:
            booking.slot = data["slot"]
            
        db.commit()
        db.close()
        
        return jsonify({"success": True, "message": "Booking updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": f"Error updating booking: {str(e)}"}), 500

@app.route("/api/login", methods=["POST"])
def api_login():
    """Admin login"""
    try:
        data = request.json
        
        # Simple hardcoded credentials (change for production)
        if data.get("username") == "admin" and data.get("password") == "password":
            session["admin"] = True
            return jsonify({"success": True, "message": "Login successful"})
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": f"Login error: {str(e)}"}), 500

@app.route("/api/logout", methods=["POST"])
def api_logout():
    """Admin logout"""
    session.pop("admin", None)
    return jsonify({"success": True, "message": "Logged out successfully"})

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "AI Sales Agent API is running"})

# ✅ Cleanup on shutdown
atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    print("🚀 Starting AI Sales Agent Backend...")
    print("📡 Reminder & Feedback bots will run every minute")
    print("🌐 API available at: http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
