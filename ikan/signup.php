<?php
include('db.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];


    $sql_check = "SELECT id_admin FROM admin WHERE user='$username'";
    $result_check = $conn->query($sql_check);

    if ($result_check->num_rows > 0) {
        $error = "Username sudah ada. Silakan pilih username lain.";
    } else {

        $sql = "INSERT INTO admin (user, password) VALUES ('$username', '$password')";
        if ($conn->query($sql) === TRUE) {
            $success = "Akun berhasil dibuat. Silakan <a href='halaman/admin.php'>login</a>.";
        } else {
            $error = "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Daftar Admin</title>
    <link rel="stylesheet" type="text/css" href="css/logstyle.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="halaman/wma.php">WMA</a></li>
                <li><a href="halaman/admin.php">Admin</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <h2>Daftar Admin</h2>
        <form action="" method="post">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <input type="submit" value="Sign Up">
        </form>
        <?php if(isset($success)) { 
            echo "<p style='color:green;'>$success</p>"; 
        } elseif(isset($error)) { 
            echo "<p style='color:red;'>$error</p>"; 
        }  ?>
    </main>
</body>
</html>
