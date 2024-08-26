<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "patient";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $drname = $_POST["drname"];
    $name = $_POST["name"];
    $email = isset($_POST["email"]) ? $_POST["email"] : "";
    $date = $_POST["date"];
    $time = $_POST["time"];
    $gender = $_POST["gender"];


    $sql = "INSERT INTO book (drname, name, email, date, time, gender) VALUES (?, ?, ?, ?, ?, ?)";


    $stmt = $conn->prepare($sql);


    $stmt->bind_param("ssssss", $drname, $name, $email, $date, $time, $gender);


    if ($stmt->execute()) {
        echo "Appointment Booked successful!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
$conn->close();
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Appointment Booking</title>
    <link rel="stylesheet" href="book_style.css">
</head>
<body>

<div class="logo">
    <a href="index.html">
        <img src="log.png" class="logo">
    </a>
</div>
<div class="navbar">
    <ul>
        <li><a href="contact_us.html">CONTACT US</a></li>
        <li><a href="help.html">HELP</a></li>
    </ul>
</div>

<div class="container">
    <h1>Doctor Appointment Booking</h1>
    <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST">
        <label for="drname">Doctor Name:</label>
        <input type="text" id="drname" name="drname" required>

        <label for="name">Patient Name:</label>
        <input type="text" id="name" name="name" required>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>

        <label for="date">Date:</label>
        <input type="date" id="date" name="date" required>

        <label for="time">Select Time Slot:</label>
        <select id="time" name="time" required>
            <option value="09:00">09:00 AM - 01:00 PM</option>
            <option value="12:00">05:00 PM - 10:00 PM</option>
        </select>

        <label for="gender">Gender:</label>
        <div class="gender-options">
            <input type="radio" id="male" name="gender" value="male" required>
            <label for="male">Male</label>
            <input type="radio" id="female" name="gender" value="female" required>
            <label for="female">Female</label>
            <input type="radio" id="other" name="gender" value="other" required>
            <label for="other">Other</label>
        </div>

        <button type="submit">Schedule Appointment</button>
    </form>
</div>
<script src="script.js"></script>

</body>
</html>


