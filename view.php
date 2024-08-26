<?php

session_start();


if (!isset($_SESSION['User'])) {
    header("Location: login1.php");
    exit();
}


$userEmail = $_SESSION['User'];
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "patient";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "SELECT * FROM book WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $userEmail);
$stmt->execute();
$result = $stmt->get_result();


$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Appointments</title>
    <link rel="stylesheet" href="view.css">
</head>

<body>
<div class="banner">
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
    <h1>Your Appointments</h1>
    <table>
        <thead>
            <tr>
                <th>Sr. No.</th>
                <th>Doctor Name</th>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Gender</th>
            </tr>
        </thead>
        <tbody>
            <?php
            $sr_no = 1;
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $sr_no . "</td>";
                echo "<td>" . $row['drname'] . "</td>";
                echo "<td>" . $row['name'] . "</td>";
                echo "<td>" . $row['date'] . "</td>";
                echo "<td>" . $row['time'] . "</td>";
                echo "<td>" . $row['gender'] . "</td>";
                echo "</tr>";
                $sr_no++;
            }
            ?>
        </tbody>
    </table>
</div>

</body>
</html>
