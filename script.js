document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".login-btn");
    const loginModal = document.getElementById("login-modal");
    const registerModal = document.getElementById("register-modal");
    const closeBtns = document.querySelectorAll(".close");
    const registerLink = document.getElementById("register-link");
    const signUpLink = document.getElementById("sign-up-link");
    const userIcon = document.getElementById("user-icon");
    const dropdownMenu = document.getElementById("dropdown-menu"); // dropdown menu
    const logoutBtn = document.getElementById("logout"); // logout option

    // Open login modal
    loginBtn.addEventListener("click", () => {
        loginModal.style.display = "block";
    });

    // Open register modal from the login modal
    registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    });

    // Open register modal from sign-up link
    signUpLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    });

    // Close modals via close buttons
    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            loginModal.style.display = "none";
            registerModal.style.display = "none";
        });
    });

    // Close modals by clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === loginModal || e.target === registerModal) {
            loginModal.style.display = "none";
            registerModal.style.display = "none";
        }
    });

    // Toggle dropdown menu on user icon click
    userIcon.addEventListener("click", () => {
        dropdownMenu.classList.toggle("hidden");
    });

    // Hide dropdown if clicked outside
    window.addEventListener("click", (e) => {
        if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.add("hidden");
        }
    });

    // Handle logout
    logoutBtn.addEventListener("click", () => {
        dropdownMenu.classList.add("hidden");
        userIcon.classList.add("hidden");
        loginBtn.style.display = "inline-block";
        alert("Logged out successfully!");
    });
});

// Handle registration
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector("#register-modal form");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = registerForm.querySelector('input[placeholder="First Name"]').value;
        const lastName = registerForm.querySelector('input[placeholder="Last Name"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const gender = registerForm.querySelector('select').value;
        const dob = registerForm.querySelector('input[type="date"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;

        try {
            const res = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, gender, dob, password })
            });

            const result = await res.json();
            if (res.ok) {
                alert(result.message);
                document.getElementById("register-modal").style.display = "none";
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});

// Handle login and show user icon
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-modal form");
    const loginBtn = document.querySelector(".login-btn");
    const userIcon = document.getElementById("user-icon");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await res.json();
            if (res.ok) {
                alert(result.message);
                document.getElementById("login-modal").style.display = "none";

                // Show user icon and hide login button
                userIcon.classList.remove("hidden");
                loginBtn.style.display = "none";
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});

// Handle Train Search
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form"); // Ensure your form has this ID

    if (searchForm) {
        searchForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const from = searchForm.querySelector('input[name="from"]').value;
            const to = searchForm.querySelector('input[name="to"]').value;
            const travelClass = searchForm.querySelector('select[name="class"]').value;

            try {
                const queryParams = new URLSearchParams({ from, to, class: travelClass });
                const res = await fetch(`http://localhost:5000/search-trains?${queryParams}`);
                const trains = await res.json();

                if (!res.ok) {
                    alert("No trains found. Please adjust your search.");
                    return;
                }

                // Update the DOM with the search results
                displayTrainResults(trains);
            } catch (error) {
                console.error("Search error:", error);
                alert("Failed to search trains. Please try again.");
            }
        });
    }
});

//display train results
function displayTrainResults(trains) {
    const resultsContainer = document.getElementById("train-results"); // Ensure you have this element
    resultsContainer.innerHTML = ""; // Clear previous results

    if (trains.length === 0) {
        resultsContainer.innerHTML = "<p>No trains found.</p>";
        return;
    }

    trains.forEach(train => {
        const trainElement = document.createElement("div");
        trainElement.className = "train-item";
        trainElement.innerHTML = `
            <h3>${train.trainName} (${train.trainNumber})</h3>
            <p>From: ${train.from} → To: ${train.to}</p>
            <p>Class: ${Object.keys(train.classes).join(", ")}</p>
        `;
        resultsContainer.appendChild(trainElement);
    });
}

//bus-booking
document.addEventListener("DOMContentLoaded", () => {
    const selectedBusContainer = document.getElementById("selectedBus");
    const bookingForm = document.getElementById("busBookingForm");
    const bookingMessage = document.getElementById("bookingMessage");
  
    const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));
  
    if (!selectedBus) {
      selectedBusContainer.innerHTML = "<p>No bus selected. Please go back and select a bus.</p>";
      bookingForm.style.display = "none";
      return;
    }
  
    selectedBusContainer.innerHTML = `
      <h2>${selectedBus.operator} - Bus No: ${selectedBus.busNumber}</h2>
      <p>From: ${selectedBus.from} → To: ${selectedBus.to}</p>
      <p>Type: ${selectedBus.type}</p>
      <p>Departure: ${selectedBus.departureTime} → Arrival: ${selectedBus.arrivalTime}</p>
      <p>Fare: ₹${selectedBus.fare}</p>
      <p>Seats Available: ${selectedBus.seatsAvailable}</p>
    `;
  
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const passengerName = document.getElementById("passengerName").value.trim();
      const seatsRequested = parseInt(document.getElementById("seats").value);
  
      if (seatsRequested > selectedBus.seatsAvailable) {
        bookingMessage.textContent = "Not enough seats available.";
        bookingMessage.style.color = "red";
        return;
      }
  
      bookingMessage.textContent = `Booking confirmed for ${passengerName}! ${seatsRequested} seat(s) booked.`;
      bookingMessage.style.color = "green";
    });
});