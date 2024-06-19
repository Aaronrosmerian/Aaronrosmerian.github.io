<!DOCTYPE html>
<html>
<head>
    <title>PIS (Projek Ikan Sili)</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
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
        <h1>PIS (Projek Ikan Sili)</h1>
        <section id="prediksi">
            <h2>Riwayat hasil prediksi</h2>
            <?php
            include('db.php');
            $sql = "SELECT * FROM laporan_prediksi";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<p>ID Laporan: " . $row["id_laporan"] . " - ID Produk: " . $row["id_produk"] . " - Tanggal Prediksi: " . $row["tanggal_prediksi"] . " - Jumlah Prediksi: " . $row["jumlah_prediksi"] . "</p>";
                }
            } else {
                echo "Tidak ada data prediksi.";
            }
            ?>
        </section>
    </main>
    <script src="js/script.js"></script>
</body>
</html>
