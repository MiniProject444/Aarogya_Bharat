<?php
$servername = "localhost";
$username = "user";
$password = "root";
$dbname = "doctor";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $studentName = $_POST['email'];
    $seatNumber = $_POST['password'];


    $sql = "INSERT INTO `users` (email, password)
            VALUES ('$email', '$password')";
    $result = mysqli_query($conn, $sql);

    if ($result === TRUE) {
        echo "Login successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
header("Location: index.php");
$conn->close();
?>
