import smtplib
from email.mime.text import MIMEText

GMAIL_ADDRESS = "remainderbot192005@gmail.com"
APP_PASSWORD = "cboapfujvvwgtmwj"

def send_email(to_email, subject, message):
    try:
        msg = MIMEText(message)
        msg["Subject"] = subject
        msg["From"] = GMAIL_ADDRESS
        msg["To"] = to_email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_ADDRESS, APP_PASSWORD)
            server.send_message(msg)

        print(f"📧 Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
