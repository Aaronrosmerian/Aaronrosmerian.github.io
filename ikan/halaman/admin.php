<?php
session_start();
include('../db.php');

if (isset($_SESSION['login_user'])) {
    header("location: dashboard.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'];
    $pass = $_POST['password'];
    $sql = "SELECT id_admin FROM admin WHERE user='$user' and password='$pass'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $_SESSION['login_user'] = $user;
        header("location: dashboard.php");
    } else {
        $error = "Username atau Password salah";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login Admin</title>
    <link rel="stylesheet" type="text/css" href="../css/logstyle.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="../index.php">Home</a></li>
                <li><a href="wma.php">WMA</a></li>
                <li><a href="admin.php">Admin</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <h2>Login Admin</h2>
        <form action="" method="post">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <input type="submit" value="Login">
        </form>
        <?php if(isset($error)) { echo "<p class='error'>$error</p>"; } ?>
        <p>Belum punya akun? <a href="../signup.php">Sign Up</a></p>
    </main>
</body>
</html>
