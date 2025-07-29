from flask import Flask, request, jsonify
from flask_cors import CORS
from crm.hubspot import create_contact
from crm.db import get_connection

app = Flask(__name__)
CORS(app)

# 🔧 Log to MySQL
def save_to_db(name, email, phone, booking_time, call_summary):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO leads (name, email, phone, booking_time, call_summary)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (name, email, phone, booking_time, call_summary)
        )
        conn.commit()
        cursor.close()
        conn.close()
        print("🗃️ Lead logged in MySQL")
    except Exception as e:
        print("❌ Failed to log to MySQL:", e)

# 🚀 Route to receive bookings
@app.route("/crm/log", methods=["POST"])
def log_to_crm():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    date = data.get("date")
    slot = data.get("slot")
    call_summary = data.get("call_summary", "")

    # ✅ Validation
    missing_fields = []
    if not name:
        missing_fields.append("name")
    if not email:
        missing_fields.append("email")
    if not phone:
        missing_fields.append("phone")
    if not date:
        missing_fields.append("date")
    if not slot:
        missing_fields.append("slot")

    if missing_fields:
        return jsonify({
            "status": "error",
            "message": f"Missing required fields: {', '.join(missing_fields)}"
        }), 400

    # ⏰ Format booking time
    booking_time = f"{date} {slot}"

    # 🔗 Send to HubSpot + DB
    if create_contact(name, email, phone, booking_time, call_summary):
        save_to_db(name, email, phone, booking_time, call_summary)
        return jsonify({
            "status": "success",
            "message": "Contact logged in HubSpot"
        }), 200
    else:
        return jsonify({
            "status": "error",
            "message": "Failed to log contact"
        }), 500

if __name__ == "__main__":
    app.run(debug=True)
