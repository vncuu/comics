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

// Menu elements (desktop/larger screens)
const authMenuDropdown = document.getElementById('authMenuDropdown'); // Desktop login/user dropdown li
const navAuthTrigger = document.getElementById('navAuthTrigger'); // Desktop "Login" text / user email
const navLogout = document.getElementById('navLogout'); // Desktop logout link
const navRiseDishonored = document.getElementById('navRiseDishonored'); // Desktop Rise Dishonored page link

// Mobile menu elements
const menuDrop = document.getElementById('menuDrop'); // Mobile dropdown trigger (the '↓' icon)
const dropdownMenu = document.getElementById('dropdownMenu'); // The actual mobile dropdown container
const mobileNavRiseDishonored = document.getElementById('mobileNavRiseDishonored'); // Mobile Rise Dishonored link
const mobileNavLogout = document.getElementById('mobileNavLogout'); // Mobile logout link

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

    // Remove 'active' class from all top-level nav links (desktop)
    document.querySelectorAll('#navbar-main > li > a').forEach(link => {
        link.classList.remove('active');
    });
    // Remove 'active' from mobile menu links
    document.querySelectorAll('#dropdownMenu a').forEach(link => {
        link.classList.remove('active');
    });

    // Show the requested page and set active class
    if (pageId === 'login-section') {
        loginSection.style.display = 'block';
        // No active class on 'Login' trigger as it changes to email
    } else if (pageId === 'rise-dishonored-page') {
        riseDishonoredPage.style.display = 'block';
        navRiseDishonored.classList.add('active'); // Desktop
        mobileNavRiseDishonored.classList.add('active'); // Mobile
    }
    // Close mobile dropdown after page selection
    dropdownMenu.classList.remove('show');
    // Close desktop auth dropdown after page selection
    authMenuDropdown.classList.remove('show');
}

// --- Mobile Menu Dropdown Logic ---
menuDrop.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownMenu.classList.toggle('show');
});

// Close mobile dropdown if user clicks outside of it
window.addEventListener('click', (event) => {
    if (!menuDrop.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// --- Desktop Auth Dropdown Logic ---
navAuthTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    authMenuDropdown.classList.toggle('show');
});

// Close desktop auth dropdown if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (!authMenuDropdown.contains(event.target)) {
        authMenuDropdown.classList.remove('show');
    }
});


// --- Event Listeners for Navigation Links ---
// Desktop links
navRiseDishonored.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('rise-dishonored-page');
});

// Mobile links
mobileNavRiseDishonored.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('rise-dishonored-page');
});

mobileNavLogout.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth)
        .then(() => {
            alert('Logged out!');
        })
        .catch(error => {
            alert('Logout failed: ' + error.message);
        });
});

// The mobile "Login / User Info" link should take to login section
document.querySelector('#dropdownMenu ul li:first-child a').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('login-section');
});


// --- Firebase Auth State Listener ---
onAuthStateChanged(auth, user => {
    if (user) {
        status.textContent = `Logged in as: ${user.email}`;

        // Hide login form elements
        loginBtn.style.display = 'none';
        emailInput.style.display = 'none';
        passwordInput.style.display = 'none';

        // Update desktop menu for logged-in state
        navAuthTrigger.textContent = user.email; // Change "Login" to user's email
        navLogout.style.display = 'block'; // Show logout link in desktop dropdown
        
        // Update mobile menu for logged-in state
        mobileNavLogout.style.display = 'block'; // Show logout in mobile dropdown
        document.querySelector('#dropdownMenu ul li:first-child a').textContent = user.email; // Change mobile "Login" to user email

        // Display welcome message in top-right
        welcomeUserDisplay.textContent = `Welcome, ${user.email.split('@')[0]}!`;
        welcomeUserDisplay.style.display = 'block';

        // Automatically show "Rise Dishonored Page" on login (or maintain current page)
        // Check if any page is currently displayed, otherwise default to Rise Dishonored
        if (loginSection.style.display === 'none' && riseDishonoredPage.style.display === 'none') {
             showPage('rise-dishonored-page');
        }


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
        status.textContent = 'Not logged in';

        // Show login form elements
        loginBtn.style.display = 'block';
        emailInput.style.display = 'block';
        passwordInput.style.display = 'block';
        roleDisplay.textContent = '';
        regenerateBtn.style.display = 'none';

        // Update desktop menu for logged-out state
        navAuthTrigger.textContent = 'Login';
        navLogout.style.display = 'none'; // Hide logout link
        
        // Update mobile menu for logged-out state
        mobileNavLogout.style.display = 'none';
        document.querySelector('#dropdownMenu ul li:first-child a').textContent = 'Login / User Info'; // Reset mobile link

        welcomeUserDisplay.style.display = 'none'; // Hide welcome message

        // When logged out, show the login page
        showPage('login-section');
    }
});

// --- Firebase Login Action ---
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

// --- Regenerate Code Action (Owner only) ---
regenerateBtn.addEventListener('click', () => {
    currentCode = generateRandomCode();
    roleDisplay.textContent = `Welcome Owner! Code: ${currentCode}`;
});
