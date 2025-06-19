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

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const status = document.getElementById('status');
const roleDisplay = document.getElementById('roleDisplay');
const articlesContainer = document.getElementById('articlesContainer'); // This is the container inside the Rise Dishonored page

// Menu elements
const navLogin = document.getElementById('navLogin');
const navLogout = document.getElementById('navLogout');
const navRiseDishonored = document.getElementById('navRiseDishonored');

// Content sections (for showing/hiding)
const loginSection = document.getElementById('login-section');
const riseDishonoredPage = document.getElementById('rise-dishonored-page'); // The new container for the articles

let currentCode = '';

function generateRandomCode() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function displayOwnerCode() {
    currentCode = generateRandomCode();
    roleDisplay.textContent = `2FA Backup Code: ${currentCode}`;
    regenerateBtn.style.display = 'block';
}

// Function to show a specific page/content and update active menu item
function showPage(pageId) {
    // Hide all main page sections
    loginSection.style.display = 'none';
    riseDishonoredPage.style.display = 'none';

    // Remove 'active' class from all nav links
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Show the requested page and set active class
    if (pageId === 'login') {
        loginSection.style.display = 'block';
        navLogin.classList.add('active');
    } else if (pageId === 'riseDishonored') {
        riseDishonoredPage.style.display = 'block';
        navRiseDishonored.classList.add('active');
    }
}

// --- Event Listeners for Navigation ---
navLogin.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior (jumping to anchor)
    showPage('login');
});

navRiseDishonored.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    showPage('riseDishonored');
});

// Initialize display to show login page by default
showPage('login');

// --- Firebase Auth State Listener ---
onAuthStateChanged(auth, user => {
    if (user) {
        status.textContent = `Logged in as: ${user.email}`;
        loginBtn.style.display = 'none';
        emailInput.style.display = 'none';
        passwordInput.style.display = 'none';

        // Update menu visibility for logged-in user
        navLogin.style.display = 'none';
        navLogout.style.display = 'block';

        // Automatically show "Rise Dishonored Page" (articles) on login
        showPage('riseDishonored');

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
        loginBtn.style.display = 'block';
        emailInput.style.display = 'block';
        passwordInput.style.display = 'block';
        roleDisplay.textContent = '';
        regenerateBtn.style.display = 'none';

        // Update menu visibility for logged-out user
        navLogin.style.display = 'block';
        navLogout.style.display = 'none';

        // When logged out, show the login page
        showPage('login');
    }
});

// --- Firebase Login/Logout Button Logic ---
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
            // Auth state change will handle page display
        })
        .catch(error => {
            alert('Login failed: ' + error.message);
        });
});

navLogout.addEventListener('click', (e) => { // Use navLogout for the menu item
    e.preventDefault(); // Prevent default link behavior
    signOut(auth)
        .then(() => {
            alert('Logged out!');
            // Auth state change will handle page display
        })
        .catch(error => {
            alert('Logout failed: ' + error.message);
        });
});

regenerateBtn.addEventListener('click', () => {
    currentCode = generateRandomCode();
    roleDisplay.textContent = `Welcome Owner! Code: ${currentCode}`;
});
