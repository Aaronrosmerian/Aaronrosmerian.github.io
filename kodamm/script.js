document.getElementById("khodamForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;

  if (name === "" || dob === "") {
    alert("Harap isi semua kolom.");
    return;
  }

  const khodam = calculateKhodam(name, dob);
  displayResult(khodam);
});

function calculateKhodam(name, dob) {
  const khodams = [
    { name: "peMalas", image: "img/ping.jpg" },
    { name: "Ceria", image: "img/kuning.jpg" },
    { name: "Turuan", image: "img/abang.jpg" },
    { name: "Ngutangan", image: "img/biru.png" },
    { name: "Cihuyyy", image: "img/khodamE.jpg" },
  ];
  const index = (name.length + new Date(dob).getDate()) % khodams.length;
  return khodams[index];
}

function displayResult(khodam) {
  const resultDiv = document.getElementById("result");
  const khodamText = document.getElementById("khodamText");
  const khodamImage = document.getElementById("khodamImage");

  khodamText.textContent = `Khodam Anda adalah: ${khodam.name}`;
  khodamImage.src = khodam.image;

  resultDiv.style.display = "block";
}
