<?php
session_start();

if (!isset($_SESSION['email'])) {
    header("Location: index.php");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "patient";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT name, date FROM book";
$result = $conn->query($sql);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Welcome Doctor </title>
    <link rel="stylesheet" href="Doc_display.css">
</head>
<body>
    <div class="banner">
        <div class="navbar">
            <img src="logo.png" class="logo">
        </div>
    </div>

    <div class="content">
        <h1>Appointments</h1>
        <table>
            <tr>
                <th>Patient Name</th>
                <th>Appointment Date</th>
            </tr>
            <?php
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>" . $row["name"] . "</td>";
                    echo "<td>" . $row["date"] . "</td>";

                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='2'>No appointments found</td></tr>";
            }
            ?>
        </table>
    </div>
    <div class="content">
    <button class="create-prescription-btn" onclick="window.location.href='pris.php'">
        <span>Create Prescription</span>
    </button>
</div>

</body>
</html>

<?php
$conn->close();
?>
