<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "doctor";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if(isset($_POST['email']) && isset($_POST['password'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];

        $stmt = $conn->prepare("SELECT * FROM login WHERE email = ? AND password = ?");
        $stmt->bind_param("ss", $email, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $_SESSION['email'] = $email;
            header("Location: Doc_Display.php");
            exit();
        } else {
            echo "Invalid Email or password.";
        }
    } else {
        echo "Email and password are required.";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor's Login Page | AsmrProg</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="login1.css">
</head>
<body>
    <div class="container" id="container">
        <div class="form-container sign-in">
            <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <h1>Sign In</h1>
                <input type="text" name="email" placeholder="Email">
                <input type="password" name="password" placeholder="Password">
                <button type="submit">Sign In</button>

                </div>
            </form>
        </div>
    </div>
</body>
</html>
