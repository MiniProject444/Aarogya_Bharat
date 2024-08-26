<?php
session_start();

if (!isset($_SESSION['email'])) {
    header("Location: index.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "doctor";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $patientId = $_POST['patientId'] ?? '';
    $patientName = $_POST['patientName'] ?? '';
    $dob = $_POST['dob'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $bloodGroup = $_POST['bloodGroup'] ?? '';
    $disease = $_POST['disease'] ?? '';
    $tabletName = $_POST['tabletName'] ?? '';
    $tabletCount = $_POST['tabletCount'] ?? '';
    $issueDate = $_POST['issueDate'] ?? '';
    $followBack = $_POST['followBack'] ?? '';
    $phone = $_POST['phone'] ?? '';

    // Check if any field is empty
    if (empty($patientId) || empty($patientName) || empty($dob) || empty($gender) || empty($bloodGroup) || empty($disease) || empty($tabletName) || empty($tabletCount) || empty($issueDate) || empty($followBack) || empty($phone)) {
        echo "All fields are required.";
    } else {
        // Insert data into the database
        $sql = "INSERT INTO pric (patientId, patientName, dob, gender, bloodGroup, disease, tabletName, tabletCount, issueDate, followBack, phone)
                VALUES ('$patientId', '$patientName', '$dob', '$gender', '$bloodGroup', '$disease', '$tabletName', '$tabletCount', '$issueDate', '$followBack', '$phone')";

        if ($conn->query($sql) === TRUE) {
            echo "Prescription saved successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Prescription Form</title>
    <link rel="stylesheet" href="pris.css">
</head>
<body>
    <div class="container">
        <h1>Prescription Form</h1>
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <label for="patientId">Patient ID:</label>
            <input type="text" id="patientId" name="patientId" required><br>
  
      <label for="patientName">Patient Name:</label>
      <input type="text" id="patientName" name="patientName" required><br>
      
      <label for="dob">DOB:</label>
      <input type="date" id="dob" name="dob" required><br>
      
      <label for="gender">Gender:</label>
      <select id="gender" name="gender" required>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select><br>
      
      <label for="bloodGroup">Blood Group:</label>
      <input type="text" id="bloodGroup" name="bloodGroup" required><br>
      
      <label for="disease">Disease:</label>
      <input type="text" id="disease" name="disease" required><br>
      
      <label for="tabletName">Tablet Name:</label>
      <input type="text" id="tabletName" name="tabletName" required><br>
      
      <label for="tabletCount">No of Tablets:</label>
      <input type="number" id="tabletCount" name="tabletCount" required><br>
      
      <label for="issueDate">Issue Date:</label>
      <input type="date" id="issueDate" name="issueDate" required><br>
      
      <label for="followBack">Follow Back:</label>
      <input type="date" id="followBack" name="followBack" required><br>
      
      <label for="phone">Phone No:</label>
      <input type="tel" id="phone" name="phone" required><br>
      
      <button type="submit">Save Prescription</button>
      <button type="reset">Clear</button>
    </form>
  </div>
</body>
</html>
