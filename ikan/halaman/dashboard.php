<?php
session_start();
include('../db.php');

if (!isset($_SESSION['login_user'])) {
    header("location: admin.php");
    exit();
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['add_product'])) {
        $nama_produk = $_POST['nama_produk'];
        $sql = "INSERT INTO produk (nama_produk) VALUES ('$nama_produk')";
        if ($conn->query($sql) === TRUE) {
            echo "Produk berhasil ditambahkan.";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif (isset($_POST['delete_product'])) {
        $id_produk = $_POST['id_produk'];
        $sql = "DELETE FROM produk WHERE id_produk='$id_produk'";
        if ($conn->query($sql) === TRUE) {
            echo "Produk berhasil dihapus.";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif (isset($_POST['add_permintaan'])) {
        $id_produk = $_POST['id_produk'];
        $tanggal = $_POST['tanggal'];
        $permintaan = $_POST['permintaan'];
        $sql = "INSERT INTO permintaan (id_produk, tanggal, permintaan) VALUES ('$id_produk', '$tanggal', '$permintaan')";
        if ($conn->query($sql) === TRUE) {
            echo "Penjualan berhasil ditambahkan.";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif (isset($_POST['delete_permintaan'])) {
        $id_penjual = $_POST['id_penjual'];
        $sql = "DELETE FROM permintaan WHERE id_penjual='$id_penjual'";
        if ($conn->query($sql) === TRUE) {
            echo "permintaan berhasil dihapus.";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif (isset($_POST['add_bobot'])) {
        $id_produk = $_POST['id_produk'];
        $periode = $_POST['periode'];
        $bobot = $_POST['bobot'];
        $sql = "INSERT INTO bobot (id_produk, periode, bobot) VALUES ('$id_produk', '$periode', '$bobot')";
        if ($conn->query($sql) === TRUE) {
            echo "Bobot berhasil ditambahkan.";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif (isset($_POST['delete_bobot'])) {
        $id_bobot = $_POST['id_bobot'];
        $sql = "DELETE FROM bobot WHERE id_bobot='$id_bobot'";
        if ($conn->query($sql) === TRUE) {
            echo "Bobot berhasil dihapus.";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Dashboard Admin</title>
    <link rel="stylesheet" type="text/css" href="../css/style.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="../index.php">Home</a></li>
                <li><a href="wma.php">WMA</a></li>
                <li><a href="admin.php">Admin</a></li>
                <li><a href="../logout.php">Logout</a></li>
            </ul>
        </nav>
    </header>
    <main>
    <h1>Dashboard Admin</h1>
        <div class="form-container">
            <section>
                <h2>Tambah/Hapus Produk</h2>
                <form action="" method="post" class="form-control">
                    <label for="nama_produk">Nama Produk:</label>
                    <input type="text" id="nama_produk" name="nama_produk" required>
                    <input type="submit" name="add_product" value="Tambah Produk">
                </form>
                <form action="" method="post" class="form-control">
                    <label for="id_produk">ID Produk:</label>
                    <input type="text" id="id_produk" name="id_produk" required>
                    <input type="submit" name="delete_product" value="Hapus Produk">
                </form>
            </section>

            <section>
                <h2>Tambah/Hapus Permintaan</h2>
                <form action="" method="post" class="form-control">
                    <label for="id_produk">ID Produk:</label>
                    <input type="text" id="id_produk" name="id_produk" required>
                    <label for="tanggal">Tanggal:</label>
                    <input type="date" id="tanggal" name="tanggal" required>
                    <label for="permintaan">Jumlah Permintaan:</label>
                    <input type="number" id="permintaan" name="permintaan" required>
                    <input type="submit" name="add_permintaan" value="Tambah permintaan">
                </form>
                <form action="" method="post" class="form-control">
                    <label for="id_penjual">ID permintaan:</label>
                    <input type="text" id="id_penjual" name="id_penjual" required>
                    <input type="submit" name="delete_permintaan" value="Hapus permintaan">
                </form>
            </section>

            <section>
                <h2>Tambah/Hapus Bobot</h2>
                <form action="" method="post" class="form-control">
                    <label for="id_produk">ID Produk:</label>
                    <input type="text" id="id_produk" name="id_produk" required>
                    <label for="periode">Periode:</label>
                    <input type="number" id="periode" name="periode" required>
                    <label for="bobot">Bobot:</label>
                    <input type="number" step="0.01" id="bobot" name="bobot" required>
                    <input type="submit" name="add_bobot" value="Tambah Bobot">
                </form>
                <form action="" method="post" class="form-control">
                    <label for="id_bobot">ID Bobot:</label>
                    <input type="text" id="id_bobot" name="id_bobot" required>
                    <input type="submit" name="delete_bobot" value="Hapus Bobot">
                </form>
            </section>

        <section>
            <h2>Data Produk</h2>
            <?php
            $sql = "SELECT * FROM produk";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<p>ID Produk: " . $row["id_produk"] . " - Nama Produk: " . $row["nama_produk"] . "</p>";
                }
            } else {
                echo "Tidak ada data produk.";
            }
            ?>

            <h2>Data permintaan</h2>
            <?php
            $sql = "SELECT * FROM permintaan";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<p>ID permintaan: " . $row["id_penjual"] . " - ID Produk: " . $row["id_produk"] . " - Tanggal: " . $row["tanggal"] . " - Jumlah permintaan: " . $row["permintaan"] . "</p>";
                }
            } else {
                echo "Tidak ada data permintaan.";
            }
            ?>

            <h2>Data Bobot</h2>
            <?php
            $sql = "SELECT * FROM bobot";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<p>ID Bobot: " . $row["id_bobot"] . " - ID Produk: " . $row["id_produk"] . " - Periode: " . $row["periode"] . " - Bobot: " . $row["bobot"] . "</p>";
                }
            } else {
                echo "Tidak ada data bobot.";
            }
            ?>

            <h2>Data Laporan Prediksi</h2>
            <?php
            $sql = "SELECT * FROM laporan_prediksi";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<p>ID Laporan: " . $row["id_laporan"] . " - ID Produk: " . $row["id_produk"] . " - Tanggal Prediksi: " . $row["tanggal_prediksi"] . " - Jumlah Prediksi: " . $row["jumlah_prediksi"] . "</p>";
                }
            } else {
                echo "Tidak ada data laporan prediksi.";
            }
            ?>
        </section>
    </main>
    <script src="../js/script.js"></script>
</body>
</html>
