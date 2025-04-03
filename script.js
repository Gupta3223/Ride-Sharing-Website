document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".login-btn");
    const loginModal = document.getElementById("login-modal");
    const registerModal = document.getElementById("register-modal");
    const closeBtns = document.querySelectorAll(".close");
    const registerLink = document.getElementById("register-link");
    const signUpLink = document.getElementById("sign-up-link"); // New line for the "Sign up today!" link

    // Open login modal
    loginBtn.addEventListener("click", () => {
        loginModal.style.display = "block";
    });

    // Open register modal from the "Register Here" link inside the login modal
    registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    });

    // Open register modal from the "Sign up today!" link in the "Join Our Community" section
    signUpLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.style.display = "none"; // Close login modal if it's open
        registerModal.style.display = "block"; // Open the registration modal
    });

    // Close modals when close button is clicked
    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            loginModal.style.display = "none";
            registerModal.style.display = "none";
        });
    });

    // Close modals when clicked outside of modal content
    window.addEventListener("click", (e) => {
        if (e.target === loginModal || e.target === registerModal) {
            loginModal.style.display = "none";
            registerModal.style.display = "none";
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.querySelector('.input-box input[placeholder="Enter location"]');
    const destinationInput = document.querySelector('.input-box input[placeholder="Enter destination"]');
    const seePricesBtn = document.querySelector('.black-btn');

    // Function to generate a random fare between ₹100 and ₹2500
    function getRandomFare() {
        return Math.floor(Math.random() * (2500 - 100 + 1) + 100);
    }

    // Event listener for "See prices" button
    seePricesBtn.addEventListener('click', () => {
        const location = locationInput.value.trim();
        const destination = destinationInput.value.trim();

        if (location && destination) {
            const fare = getRandomFare();

            // Show the fare pop-up
            const farePopup = document.createElement('div');
            farePopup.classList.add('fare-popup');
            farePopup.innerHTML = `
                <div class="popup-content">
                    <span class="close-popup">&times;</span>
                    <h2>Estimated Fare</h2>
                    <p>The estimated fare from <b>${location}</b> to <b>${destination}</b> is:</p>
                    <h3>₹${fare}</h3>
                </div>
            `;
            document.body.appendChild(farePopup);

            // Close the pop-up
            farePopup.querySelector('.close-popup').addEventListener('click', () => {
                farePopup.remove();
            });
        } else {
            alert('Please enter both location and destination.');
        }
    });
});


// cab page
document.addEventListener('DOMContentLoaded', function() {
    const cabButton = document.querySelector('.book-btn:nth-child(3)'); // Cab button is the third in the list
    cabButton.addEventListener('click', function() {
        window.location.href = 'cab-booking.html';
    });
});
