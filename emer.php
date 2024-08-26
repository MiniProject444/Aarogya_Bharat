<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection parameters
    $servername = "localhost"; // Change this if your database is hosted elsewhere
    $username = "root"; // Change this
    $password = ""; // Change this
    $dbname = "emergency";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Retrieve form data
    $patientName = $_POST['patient-name'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $contactNo = $_POST['contact-no'];
    $pickupLocation = $_POST['pickup-location'];

    // SQL to insert data into table
    $sql = "INSERT INTO data (patient_name, age, gender, contact_no, pickup_location)
            VALUES ('$patientName', '$age', '$gender', '$contactNo', '$pickupLocation')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Record added successfully');</script>";
    } else {
        echo "<script>alert('Error: " . $sql . "<br>" . $conn->error . "');</script>";
        // Log the error to a file
        error_log("Error: " . $sql . "\n" . $conn->error, 3, "error.log");
    }

    $conn->close();
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Emergency Form</title>
<link rel="stylesheet" type="text/css" href="emer.style.css">
</head>
<body>
    <img src="logo.png" class="logo" alt="Logo">
    <div class="container">
        <h1>Emergency</h1>
        <form id="emergency-form">
            <label for="patient-name">Patient Name:</label>
            <input type="text" id="patient-name" name="patient-name" required>
            <label for="age">Age:</label>
            <input type="number" id="age" name="age" required>
            <label>Gender:</label>
            <input type="radio" id="male" name="gender" value="Male"><label for="male">Male</label>
            <input type="radio" id="female" name="gender" value="Female"><label for="female">Female</label>
            <label for="contact-no">Contact No:</label>
            <input type="text" id="contact-no" name="contact-no" required>
            <label for="pickup-location">Pickup Location:</label>
            <input type="text" id="pickup-location" name="pickup-location" required>
            <button type="submit">Submit</button>
        </form>
    </div>
</body>
</html>