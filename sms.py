import twilio
from twilio.rest import Client


# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = 'AC86d0340512d632583e46b0386db817db'
auth_token = '01472983713164f85a22bb1847af347c'
client = Client(account_sid, auth_token)

message = client.messages.create(
         body='Thank you!\n You Have Successfully Booked An Appoinment on Aarogya Bharat',
         from_='+15518883393',
         to='+919987118792'
     )

print(message.sid)