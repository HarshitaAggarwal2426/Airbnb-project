// const whereField = document.getElementById("whereField");
// const dropdown = document.getElementById("whereDropdown");
// const selectedDestination = document.getElementById("selected-destination");
// const searchBtn = document.getElementById("searchBtn");
// const collapsed = document.getElementById("searchCollapsed");
// const expanded = document.getElementById("searchExpanded");
// const whereField = document.getElementById("whereField");
// const dropdown = document.getElementById("whereDropdown");
// const selected = document.getElementById("selected-destination");

// if (whereField && dropdown) {

//   // toggle dropdown on click
//   whereField.addEventListener("click", (e) => {
//     e.stopPropagation();
//     dropdown.style.display =
//       dropdown.style.display === "block" ? "none" : "block";
//   });

//   // select item
//   document.querySelectorAll("#whereDropdown li").forEach((item) => {
//     item.addEventListener("click", (e) => {
//       selected.textContent = item.textContent;   // set value
//       dropdown.style.display = "none";           // close dropdown
//     });
//   });

//   // close when clicking outside
//   document.addEventListener("click", () => {
//     dropdown.style.display = "none";
//   });
// }

// if (collapsed) {
//   collapsed.addEventListener("click", () => {
//     collapsed.classList.add("hide");
//     expanded.classList.add("active");
//   });
// }

// // Toggle dropdown
// whereField.onclick = () => {
//   dropdown.style.display =
//     dropdown.style.display === "block" ? "none" : "block";
// };

// // Select category from dropdown
// dropdown.onclick = (e) => {
//   if (e.target.tagName === "LI") {
//     selectedDestination.textContent = e.target.textContent;
//     dropdown.style.display = "none";
//   }
// };

// // Hide dropdown when clicking outside
// document.onclick = (e) => {
//   if (!whereField.contains(e.target)) dropdown.style.display = "none";
// };

// // When Search button is clicked
// searchBtn.onclick = () => {
//   const destination = selectedDestination.textContent.trim();
//   const checkin = document.getElementById("checkin").value;
//   const checkout = document.getElementById("checkout").value;
//   const guests = document.getElementById("guests").value;

//   // Redirect to listings page with query params
//   const params = new URLSearchParams({
//     search: destination,
//     checkin,
//     checkout,
//     guests,
//   });

//   window.location.href = `/listings?${params.toString()}`;
// };
document.addEventListener("DOMContentLoaded", () => {

  const whereField = document.getElementById("whereField");
  const dropdown = document.getElementById("whereDropdown");
  const selected = document.getElementById("selected-destination");

  const collapsed = document.getElementById("searchCollapsed");
  const expanded = document.getElementById("searchExpanded");

  const searchBtn = document.getElementById("searchBtn");

  if (!whereField || !dropdown) return;

  // ✅ TOGGLE DROPDOWN
  whereField.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });

  // ✅ SELECT OPTION
  dropdown.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      selected.textContent = item.textContent;
      dropdown.style.display = "none";
    });
  });

  // ✅ CLOSE ON OUTSIDE CLICK
  document.addEventListener("click", () => {
    dropdown.style.display = "none";
  });

  // ✅ MOBILE EXPAND SEARCH
  if (collapsed && expanded) {
    collapsed.addEventListener("click", () => {
      collapsed.classList.add("hide");
      expanded.classList.add("active");
    });
  }

  // ✅ SEARCH BUTTON
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const destination = selected.textContent.trim();
      const checkin = document.getElementById("checkin").value;
      const checkout = document.getElementById("checkout").value;
      const guests = document.getElementById("guests").value;

      const params = new URLSearchParams({
        search: destination,
        checkin,
        checkout,
        guests,
      });

      window.location.href = `/listings?${params.toString()}`;
    });
  }

});