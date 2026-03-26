document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map");

  const lat = coordinates[1];
  const lng = coordinates[0];

  map.setView([lat, lng], 13);

  L.tileLayer(
    `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${mapToken}`,
    {
      attribution:
        'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors',
    }
  ).addTo(map);

  const redIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });

  L.marker([lat, lng], { icon: redIcon })
    .addTo(map)
    .bindPopup(
      `<div style="text-align:center">
         <b>${title}</b><br>
         <small style="color:gray;">Exact location will be provided after booking.</small>
       </div>`
    )
    .openPopup();
});