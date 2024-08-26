<!DOCTYPE html>
<html>
  <head>
    <title>Aarogya Bharat</title>
    <link rel="stylesheet" href="home.css">
    <style>
      /* CSS for the heading */
      .content h1 {
        font-family: Arial, sans-serif;
        font-size: 50px; /* Adjust the font size for the heading */
        font-weight: bold; /* Optionally set the font weight for the heading */
        color: #333; /* Set the text color for the heading */
      }

      /* CSS for the paragraph */
      .content p {
        font-family: "Your Paragraph Font", Arial, sans-serif; /* Specify the font for the paragraph */
        font-size: 26px; /* Adjust the font size for the paragraph */
        font-weight: normal; /* Optionally set the font weight for the paragraph */
        color: #444; /* Set the text color for the paragraph */
      }
    </style>
  </head>
  <body>
    <div class="banner">

      <div class="logo">
        <a href="home.php">
        <img src="log.png" class="logo">
      </div>
      <div class="navbar">
        <ul>
          <li><a href="contact.html">CONTACT US</a></li>
          <li><a href="help.html">HELP</a></li>
        </ul>
      </div>
      <div class="txt">
        <p class="slide-text">
        "Welcome to Aarogya Bharat, your trusted platform for <br>
        efficient doctor management. Streamline your healthcare <br>
        services with us, ensuring seamless operations and optimal<br>
        patient care."<br>
        </p>
        <br>
      <marquee behavior="scroll" direction="left">
        Click "Patient" To Book Appointment:
      </marquee>
      </div>
      <div class="button-container">
        <a href="pat.php" class="button patient">Patient</a>
        <a href="doctorlog.php" class="button doctor">Doctor</a>

        <style>
/* Style for the button */
button.emergency {
  background-color: rgba(166, 0, 0, 0.679);
    color: white;
    border: none;
    padding: 10px 20px;
    top: 20px; /* Adjust this value to position the container vertically */
   right: 20px;
    border-radius: 8px;
    cursor: pointer;
}

button.emergency:hover {
  background-color: rgb(255, 4, 4);
  box-shadow: 0 0 10px 0 rgba(201, 0, 0, 0.662);
}
</style>

<!-- Button for emergency -->
<button class="emergency" onclick="window.location.href='emer.php'">
    Emergency
</button>
  </div>
    </div>
    </div>
  </body>
</html>
