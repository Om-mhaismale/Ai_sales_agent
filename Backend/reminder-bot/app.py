from flask import Flask, request, session, jsonify 
from flask_cors import CORS  # Add this import
from database import SessionLocal
from models import Booking
from apscheduler.schedulers.background import BackgroundScheduler
from reminder import run_reminder_bot, run_feedback_bot
import time

app = Flask(__name__)
app.secret_key = "your-secret"
CORS(app)  # Add this line so React can connect

# ✅ Scheduler setup
scheduler = BackgroundScheduler()
scheduler.add_job(run_reminder_bot, 'interval', minutes=1)
scheduler.add_job(run_feedback_bot, 'interval', minutes=1)
scheduler.start()

# ✅ NEW API ROUTES

# API: Save a booking (when user fills form in React)
@app.route("/api/bookings", methods=["POST"])
def create_booking():
    data = request.json  # Get data from React
    
    db = SessionLocal()
    booking = Booking(
        name=data["name"],
        phone=data["phone"], 
        email=data["email"],
        date=data["date"],
        slot=data["slot"]
    )
    db.add(booking)
    db.commit()
    db.close()
    
    return jsonify({"success": True, "message": "Booking created"})

# API: Get all bookings (for admin panel in React)
@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    db = SessionLocal()
    bookings = db.query(Booking).all()
    
    # Convert to list that React can use
    bookings_list = []
    for b in bookings:
        bookings_list.append({
            "id": b.id,
            "name": b.name,
            "phone": b.phone,
            "email": b.email,
            "date": b.date,
            "slot": b.slot,
            "reminder_sent": b.reminder_sent,
            "feedback_sent": b.feedback_sent,
            "status": getattr(b, 'status', 'scheduled'),  # Handle missing status field
            "notes": getattr(b, 'notes', None)  # Handle missing notes field
        })
    
    db.close()
    return jsonify(bookings_list)

# API: Update a booking (for cancellation, status changes, etc.)
@app.route("/api/bookings/<int:booking_id>", methods=["PUT"])
def update_booking(booking_id):
    try:
        data = request.json
        db = SessionLocal()
        
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            db.close()
            return jsonify({"success": False, "message": "Booking not found"}), 404
        
        # Update fields that are provided
        if "status" in data:
            booking.status = data["status"]
            
        if "notes" in data:
            booking.notes = data["notes"]
            
        # Update other fields if provided
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

# API: Check login credentials
@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json
    
    if data["username"] == "admin" and data["password"] == "password":
        session["admin"] = True
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"})

# ✅ REMOVE the old /logout route, ADD new API logout
@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.pop("admin", None)
    return jsonify({"success": True, "message": "Logged out"})

# ✅ Shutdown scheduler on app exit
import atexit
atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    app.run(debug=True)
