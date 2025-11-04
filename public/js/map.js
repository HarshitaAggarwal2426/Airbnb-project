document.addEventListener("DOMContentLoaded", () => {
  const apiKey = mapToken;

  async function loadMapFor(place) {
    try {
      if (!place) {
        console.error("No place provided");
        return;
      }
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          place
        )}&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Geoapify error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.features || !data.features.length) {
        alert("Location not found!");
        return;
      }

      const { lat, lon } = data.features[0].properties;

      const map = L.map("map").setView([lat, lon], 12);

      L.tileLayer(
        `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`,
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

      L.marker([lat, lon], { icon: redIcon })
        .addTo(map)
        .bindPopup(
          `<div style="text-align:center">
             <b>${title}</b><br>
             <small style="color:gray;">Exact location will be provided after booking.</small>
           </div>`
        )
        .openPopup();
    } catch (err) {
      console.error("Error loading map:", err);
    }
  }

  // Example: load Delhi
  loadMapFor(placeLocation);
});
