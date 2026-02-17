let selectedLat = null;
let selectedLon = null;

const map = L.map('map').setView([40.4093, 49.8671], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

let marker;

map.on('click', function(e) {
  selectedLat = e.latlng.lat;
  selectedLon = e.latlng.lng;

  document.getElementById("lat").textContent = selectedLat.toFixed(5);
  document.getElementById("lon").textContent = selectedLon.toFixed(5);

  if (marker) {
    marker.setLatLng(e.latlng);
  } else {
    marker = L.marker(e.latlng).addTo(map);
  }
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  if (!selectedLat) return alert("Please select a location on the map first.");

  await fetch("/api/profile/home", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      lat: selectedLat,
      lon: selectedLon
    })
  });

  window.location.href = "/weather/weather.html";
});
