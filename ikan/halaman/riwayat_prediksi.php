<?php include('../db.php'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Riwayat Prediksi</title>
    <link rel="stylesheet" type="text/css" href="../css/style.css">
    <script src="../js/script.js"></script>
</head>
<body>
    <h1>Riwayat Prediksi</h1>
    <div id="riwayat">
        <?php
        $sql = "SELECT * FROM laporan_prediksi";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<p>Produk: " . $row["id_produk"]. " - Tanggal: " . $row["tanggal_prediksi"]. " - Prediksi: " . $row["jumlah_prediksi"]. "</p>";
            }
        } else {
            echo "Tidak ada data prediksi.";
        }
        ?>
    </div>
</body>
</html>
