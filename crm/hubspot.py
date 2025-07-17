import os
import requests
from dotenv import load_dotenv
from datetime import datetime
import time

load_dotenv()

HUBSPOT_API_KEY = os.getenv("HUBSPOT_API_KEY")
HUBSPOT_BASE_URL = "https://api.hubapi.com/crm/v3/objects/contacts"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {HUBSPOT_API_KEY}"
}

def create_contact(name, email, phone, booking_time, call_summary):
    # Convert booking_time to epoch milliseconds
    booking_time_epoch = None
    if booking_time:
        try:
            dt = datetime.strptime(booking_time, "%Y-%m-%d %H:%M")
            booking_time_epoch = int(dt.timestamp() * 1000)  # in milliseconds
        except ValueError as e:
            print("❌ Invalid booking_time format:", booking_time)
            booking_time_epoch = None

    data = {
        "properties": {
            "firstname": name,
            "email": email,
            "phone": phone,
            "hs_lead_status": "NEW"
        }
    }

    if booking_time_epoch:
        data["properties"]["booking_time"] = booking_time_epoch

    print("📤 Sending to HubSpot:", data)

    try:
        url = f"https://api.hubapi.com/crm/v3/objects/contacts/{email}?idProperty=email"
        response = requests.patch(url, json=data, headers=headers)

        print("📥 HubSpot Response:", response.status_code)
        print(response.text)

        if response.status_code in [200, 201]:
            print("✅ Contact created or updated successfully.")
            return True
        else:
            print("❌ Failed to upsert contact.")
            return False

    except Exception as e:
        print("❌ Exception while contacting HubSpot:", e)
        return False
