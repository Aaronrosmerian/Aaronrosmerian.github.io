<?php include('../db.php'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>WMA - PIS</title>
    <link rel="stylesheet" type="text/css" href="../css/style.css">
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
<body>
    <div class="form-container">
        <section><h1>Prediksi Menggunakan WMA</h1>
    <form method="post" action="" class="form-control">
        <label for="id_produk">ID Produk:</label>
        <input type="text" id="id_produk" name="id_produk"><br><br>
        <input type="submit" name="prediksi" value="Prediksi">
    </form>
</section>
    </div>
    
    <section>
        <h2>Data Produk dan Permintaan</h2>
        <table>
            <thead>
                <tr>
                    <th>ID Produk</th>
                    <th>Nama Produk</th>
                    <th>Bobot</th>
                    <th>Tanggal permintaan</th>
                    <th>Jumlah Permintaan</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $sql = "SELECT p.id_produk, p.nama_produk, b.bobot, b.periode, pn.tanggal, pn.permintaan
                        FROM produk p
                        LEFT JOIN bobot b ON p.id_produk = b.id_produk
                        LEFT JOIN permintaan pn ON p.id_produk = pn.id_produk";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        echo "<tr>
                                <td>" . $row["id_produk"] . "</td>
                                <td>" . $row["nama_produk"] . "</td>
                                <td>" . $row["bobot"] . "</td>
                                <td>" . $row["tanggal"] . "</td>
                                <td>" . $row["permintaan"] . "</td>
                              </tr>";
                    }
                } else {
                    echo "<tr><td colspan='6'>Tidak ada data.</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </section>
    <script src="../js/script.js"></script>
</body>
</html>
<?php
if (isset($_POST['prediksi'])) {
    $id_produk = $_POST['id_produk'];
    $sql = "SELECT p.nama_produk, SUM(pj.permintaan * b.bobot) / SUM(b.bobot) AS jumlah_prediksi
            FROM permintaan pj
            JOIN produk p ON pj.id_produk = p.id_produk
            JOIN bobot b ON pj.id_produk = b.id_produk
            WHERE pj.id_produk = '$id_produk'
            AND pj.tanggal BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND CURDATE()
            GROUP BY p.nama_produk";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $nama_produk = $row["nama_produk"];
            $jumlah_prediksi = $row["jumlah_prediksi"];
            echo "<p>Produk: " . $nama_produk . " - Prediksi: " . $jumlah_prediksi . "</p>";

            // Menyimpan hasil prediksi ke dalam tabel laporan_prediksi
            $tanggal_prediksi = date('Y-m-d');
            $insert_sql = "INSERT INTO laporan_prediksi (id_produk, tanggal_prediksi, jumlah_prediksi) 
                           VALUES ('$id_produk', '$tanggal_prediksi', '$jumlah_prediksi')";
            if ($conn->query($insert_sql) === TRUE) {
                echo "<p>Hasil prediksi telah disimpan.</p>";
            } else {
                echo "Error: " . $insert_sql . "<br>" . $conn->error;
            }
        }
    } else {
        echo "Tidak ada data untuk ID produk tersebut.";
    }
}
?>
</body>
</html>
