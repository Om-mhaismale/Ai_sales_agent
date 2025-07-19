# whatsapp.py

import requests

INSTANCE_ID = "instance133643"   # 👈 Replace with your instance ID
TOKEN = "88t2a7ghenyy3asc"               # 👈 Replace with your token

def send_whatsapp_message(phone_number, message):
    url = f"https://api.ultramsg.com/{INSTANCE_ID}/messages/chat"
    
    payload = {
        "token": TOKEN,
        "to": phone_number,
        "body": message
    }

    response = requests.post(url, data=payload)

    if response.status_code == 200:
        print(f"✅ WhatsApp sent to {phone_number}")
    else:
        print(f"❌ Failed to send WhatsApp to {phone_number}: {response.text}")
