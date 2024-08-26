<?php
// Start session
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "patient";

// Create connection
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


// If the registration form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register'])) {
    // Get the input data from the form
    $name = $_POST["name"];
    $number = isset($_POST["number"]) ? $_POST["number"] : ""; // Check if the phone number is set, otherwise use an empty string
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Insert the data into the database
    $sql = "INSERT INTO signup (name, number, email, password) VALUES (?, ?, ?, ?)";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    // Bind the variables to the statement as parameters
    $stmt->bind_param("ssss", $name, $number, $email, $password);

    // Execute the statement
    if ($stmt->execute()) {
        $registrationSuccessMessage = "Registration successful!";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close the statement
    $stmt->close();
}

// If the login form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['login'])) {
    // Get the input data from the form
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Check if the email and password match a record in the database
    $sql = "SELECT * FROM signup WHERE email = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    // If a record is found, set session variable and redirect, else show error
    if ($result->num_rows > 0) {
        $_SESSION['User'] = $email; // Set the 'User' session variable
        header("Location: view.php"); // Redirect to view.php or any other page
        exit();
    } else {
        $loginErrorMessage = "User not found!";
    }
}

// Close the database connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="login1.css">
    <title>Patient's Login Page | AsmrProg</title>
</head>

<body>
    <div class="logo">
        <a href="index.php">
            <img src="log.png" class="logo">
        </a>
    </div>
    <div class="navbar">
        <ul>
            <li><a href="contact_us.html">CONTACT US</a></li>
            <li><a href="help.html">HELP</a></li>
        </ul>
    </div>

    <div class="container" id="container">
        <div class="form-container sign-up">
            <form method="POST" action="login1.php">
                <h1>Create Account</h1>
                <input type="text" name="name" placeholder="Name" required>
                <input type="tel" name="number" placeholder="Phone Number" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit" name="register">Sign Up</button>
                <?php if (!empty($registrationSuccessMessage)) : ?>
                    <p><?= $registrationSuccessMessage ?></p>
                <?php endif; ?>
            </form>
        </div>
        <div class="form-container sign-in">
            <form method="POST" action="login1.php">
                <h1>Sign In</h1>
                <?php if (!empty($loginErrorMessage)) : ?>
                    <p><?= $loginErrorMessage ?></p>
                <?php endif; ?>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit" name="login">Sign In</button>
            </form>
        </div>
        <div class="toggle-container">
            <div class="toggle">
                <div class="toggle-panel toggle-left">
                    <h1>Welcome Back!</h1>
                    <p>Enter your personal details to book an Appointment</p>
                    <button class="hidden" id="login">Sign In</button>
                </div>
                <div class="toggle-panel toggle-right">
                    <h1>Welcome, User!</h1>
                    <p>Enter your personal details to create an account on Aarogya Bharat</p>
                    <button class="hidden" id="register">Sign Up</button>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>

</html>
