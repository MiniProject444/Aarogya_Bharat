import cgi
from twilio.rest import Client

# Twilio credentials
account_sid = 'AC86d0340512d632583e46b0386db817db'
auth_token = '01472983713164f85a22bb1847af347c'

# Function to send SMS
def send_sms(patient_name, contact_no):
    client = Client(account_sid, auth_token)
    message_body = f'Thank you, {patient_name}! You have successfully booked an appointment on Aarogya Bharat.'
    try:
        message = client.messages.create(
            body=message_body,
            from_='+15518883393',
            to=contact_no
        )
        return message.sid
    except Exception as e:
       print(f"Error occurred while sending SMS: {str(e)}")
       return None

# Main function
if __name__ == "__main__":
    form = cgi.FieldStorage()

    # Get form data
    patient_name = form.getvalue('patient-name')
    contact_no = form.getvalue('contact-no')

    # Send SMS
    if patient_name and contact_no:
        result = send_sms(patient_name, contact_no)
        if result:
            print("Content-Type: text/html\n")
            print("SMS sent successfully!")
        else:
            print("Content-Type: text/html\n")
            print("Failed to send SMS. Please try again later.")
    else:
        print("Content-Type: text/html\n")
        print("Invalid form data. Please provide patient name and contact number.")
