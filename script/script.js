import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAOaULLFRJPWko_rVuJqhugCDi8wJzl1WE",
  authDomain: "rise-80783.firebaseapp.com",
  projectId: "rise-80783",
  storageBucket: "rise-80783.appspot.com",
  messagingSenderId: "569657077839",
  appId: "1:569657077839:web:2fe104e4a7f00b7226fa3a",
  measurementId: "G-DW52DVE31M"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

// Get DOM elements
const navbar = document.getElementById('navbar');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const status = document.getElementById('status');
const navAuthTrigger = document.getElementById('navAuthTrigger');
const navLogout = document.getElementById('navLogout');
const navRiseDishonored = document.getElementById('navRiseDishonored');
const menuDrop = document.getElementById('menuDrop');
const dropdownMenu = document.getElementById('dropdownMenu');
const authMenuDropdown = document.getElementById('authMenuDropdown');

const mobileNavUser = document.getElementById('mobileNavUser');
const mobileNavRiseDishonored = document.getElementById('mobileNavRiseDishonored');
const mobileNavLogout = document.getElementById('mobileNavLogout');

const welcomeUserDisplay = document.getElementById('welcomeUserDisplay');
const loginSection = document.getElementById('login-section');
const riseDishonoredPage = document.getElementById('rise-dishonored-page');

// Helper to show pages and hide others
function showPage(page) {
  loginSection.style.display = 'none';
  riseDishonoredPage.style.display = 'none';

  if (page === 'login') {
    loginSection.style.display = 'block';
  } else if (page === 'rise') {
    riseDishonoredPage.style.display = 'block';
  }

  dropdownMenu.classList.remove('show');
  authMenuDropdown.classList.remove('show');
}

// Toggle mobile dropdown menu
menuDrop.addEventListener('click', (e) => {
  e.preventDefault();
  dropdownMenu.classList.toggle('show');
});

// Close dropdown if clicked outside
window.addEventListener('click', (e) => {
  if (!menuDrop.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('show');
  }
});

// Toggle desktop auth dropdown
navAuthTrigger.addEventListener('click', (e) => {
  e.preventDefault();
  authMenuDropdown.classList.toggle('show');
});

// Close auth dropdown if clicked outside
window.addEventListener('click', (e) => {
  if (!navAuthTrigger.contains(e.target) && !authMenuDropdown.contains(e.target)) {
    authMenuDropdown.classList.remove('show');
  }
});

// Desktop navigation clicks
navRiseDishonored.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('rise');
});

// Mobile navigation clicks
mobileNavRiseDishonored.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('rise');
});

mobileNavUser.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('login');
});

// Logout handlers
navLogout.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth).catch(error => alert('Logout failed: ' + error.message));
});

mobileNavLogout.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth).catch(error => alert('Logout failed: ' + error.message));
});

// Monitor auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    navbar.style.display = 'flex';
    showPage('rise');
    status.textContent = `Logged in as: ${user.email}`;
    navAuthTrigger.textContent = user.email;
    mobileNavUser.textContent = user.email;
    welcomeUserDisplay.textContent = `Welcome, ${user.email.split('@')[0]}!`;
    welcomeUserDisplay.style.display = 'block';
  } else {
    // User logged out
    navbar.style.display = 'none';
    welcomeUserDisplay.style.display = 'none';
    status.textContent = 'Not logged in';
    navAuthTrigger.textContent = 'Login';
    mobileNavUser.textContent = 'Login / User Info';
    showPage('login');
  }
});

// Login button logic
loginBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Please enter email and password.');
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .catch(error => {
      alert('Login failed: ' + error.message);
    });
});
