import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOaULLFRJPWko_rVuJqhugCDi8wJzl1WE",
    authDomain: "rise-80783.firebaseapp.com",
    projectId: "rise-80783",
    storageBucket: "rise-80783.appspot.com",
    messagingSenderId: "569657077839",
    appId: "1:569657077839:web:2fe104e4a7f00b7226fa3a",
    measurementId: "G-DW52DVE31M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get HTML elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const status = document.getElementById('status');
const roleDisplay = document.getElementById('roleDisplay');

// Menu elements
const authMenuDropdown = document.getElementById('authMenuDropdown');
const navAuthTrigger = document.getElementById('navAuthTrigger'); // The "Login" button in the menu
const navLogout = document.getElementById('navLogout'); // Logout link inside dropdown
const navRiseDishonored = document.getElementById('navRiseDishonored');
const welcomeUserDisplay = document.getElementById('welcomeUserDisplay'); // Top-right welcome message

// Content sections
const loginSection = document.getElementById('login-section');
const riseDishonoredPage = document.getElementById('rise-dishonored-page');

let currentCode = '';

function generateRandomCode() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function displayOwnerCode() {
    currentCode = generateRandomCode();
    roleDisplay.textContent = `2FA Backup Code: ${currentCode}`;
    regenerateBtn.style.display = 'block';
}

// --- Page Display Logic ---
function showPage(pageId) {
    // Hide all main page sections
    loginSection.style.display = 'none';
    riseDishonoredPage.style.display = 'none';

    // Remove 'active' class from all top-level nav links
    document.querySelectorAll('#navbar-main > li > a').forEach(link => {
        link.classList.remove('active');
    });

    // Show the requested page and set active class
    if (pageId === 'login') {
        loginSection.style.display = 'block';
        // Note: navAuthTrigger becomes the user's email, so don't set it active
    } else if (pageId === 'riseDishonored') {
        riseDishonoredPage.style.display = 'block';
        navRiseDishonored.classList.add('active');
    }
    // Close dropdown after page selection
    authMenuDropdown.classList.remove('show');
}

// --- Menu Dropdown Logic ---
navAuthTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    // Toggle the 'show' class to display/hide the dropdown content
    authMenuDropdown.classList.toggle('show');
});

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', (event) => {
    // Check if the click is outside the dropdown itself or its trigger
    if (!authMenuDropdown.contains(event.target)) {
        if (authMenuDropdown.classList.contains('show')) {
            authMenuDropdown.classList.remove('show');
        }
    }
});

// --- Event Listeners for Navigation Links ---
navRiseDishonored.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('riseDishonored');
});

// --- Firebase Auth State Listener ---
onAuthStateChanged(auth, user => {
    if (user) {
        status.textContent = `Logged in as: ${user.email}`; // For internal status display

        // Hide login form elements
        loginBtn.style.display = 'none';
        emailInput.style.display = 'none';
        passwordInput.style.display = 'none';

        // Update menu for logged-in state
        navAuthTrigger.textContent = user.email; // Change "Login" to user's email
        navLogout.style.display = 'block'; // Show logout link in dropdown
        
        // Display welcome message in top-right
        welcomeUserDisplay.textContent = `Welcome, ${user.email.split('@')[0]}!`; // Display username part of email
        welcomeUserDisplay.style.display = 'block';

        // Automatically show "Rise Dishonored Page" on login
        showPage('riseDishonored');

        // Role-based logic for owner code
        if (user.email === 'gogo.lindor@gmail.com') {
            displayOwnerCode();
        } else {
            const roles = {
                "admin1@example.com": "Admin",
                "staff1@example.com": "Staff",
                "moderator@example.com": "Moderator"
            };
            const role = roles[user.email] || "User";
            roleDisplay.textContent = `Welcome ${role}`;
            regenerateBtn.style.display = 'none';
        }
    } else {
        status.textContent = 'Not logged in'; // For internal status display

        // Show login form elements
        loginBtn.style.display = 'block';
        emailInput.style.display = 'block';
        passwordInput.style.display = 'block';
        roleDisplay.textContent = '';
        regenerateBtn.style.display = 'none';

        // Update menu for logged-out state
        navAuthTrigger.textContent = 'Login'; // Change back to "Login"
        navLogout.style.display = 'none'; // Hide logout link
        welcomeUserDisplay.style.display = 'none'; // Hide welcome message

        // When logged out, show the login page
        showPage('login');
    }
});

// --- Firebase Login/Logout Action Buttons ---
loginBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
        alert('Please enter email and password.');
        return;
    }
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert('Logged in successfully!');
            // onAuthStateChanged will handle UI updates
        })
        .catch(error => {
            alert('Login failed: ' + error.message);
        });
});

navLogout.addEventListener('click', (e) => { // This is the logout link in the dropdown
    e.preventDefault();
    signOut(auth)
        .then(() => {
            alert('Logged out!');
            // onAuthStateChanged will handle UI updates
        })
        .catch(error => {
            alert('Logout failed: ' + error.message);
        });
});

regenerateBtn.addEventListener('click', () => {
    currentCode = generateRandomCode();
    roleDisplay.textContent = `Welcome Owner! Code: ${currentCode}`;
});
