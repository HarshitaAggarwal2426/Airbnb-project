const whereField = document.getElementById("whereField");
const dropdown = document.getElementById("whereDropdown");
const selectedDestination = document.getElementById("selected-destination");
const searchBtn = document.getElementById("searchBtn");

// Toggle dropdown
whereField.onclick = () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
};

// Select category from dropdown
dropdown.onclick = (e) => {
  if (e.target.tagName === "LI") {
    selectedDestination.textContent = e.target.textContent;
    dropdown.style.display = "none";
  }
};

// Hide dropdown when clicking outside
document.onclick = (e) => {
  if (!whereField.contains(e.target)) dropdown.style.display = "none";
};

// When Search button is clicked
searchBtn.onclick = () => {
  const destination = selectedDestination.textContent.trim();
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const guests = document.getElementById("guests").value;

  // Redirect to listings page with query params
  const params = new URLSearchParams({
    search: destination,
    checkin,
    checkout,
    guests,
  });

  window.location.href = `/listings?${params.toString()}`;
};
