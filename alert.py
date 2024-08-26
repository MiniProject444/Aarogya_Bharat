
import sys
import smtplib
from email.message import EmailMessage

def email_alert(subject, body, to):
    msg = EmailMessage()
    msg.set_content(body)
    msg['Subject'] = subject
    msg['To'] = to
    
    user = "aarogyabharat01@gmail.com"  # Update with your email address
    msg['From'] = user
    password = "evhbvkfjsyhexqhg"  # Update with your email password

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(user, password)
        server.send_message(msg)
        server.quit()
        print("Email sent successfully!")
    except Exception as e:
        print("Error sending email:", e)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        email = sys.argv[1]
        email_alert("Aarogya Bharat", "Thank you!\nYou have successfully booked an appointment on Aarogya Bharat.", email)
    else:
        print("No email address provided.")
