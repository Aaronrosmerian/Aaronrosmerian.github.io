<?php
session_start();
include('db.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['user'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM admin WHERE user='$user' AND password='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $_SESSION['login_user'] = $user;
        header("location: halaman/dashboard.php");
    } else {
        echo "Username atau Password salah.";
    }
}
?>
