import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOaULLFRJPWko_rVuJqhugCDi8wJzl1WE",
  authDomain: "rise-80783.firebaseapp.com",
  projectId: "rise-80783",
  storageBucket: "rise-80783.appspot.com",
  messagingSenderId: "569657077839",
  appId: "1:569657077839:web:2fe104e4a7f00b7226fa3a",
  measurementId: "G-DW52DVE31M"
};

initializeApp(firebaseConfig);
const auth = getAuth();

// Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const statusEl = document.getElementById('status');
const roleDisplay = document.getElementById('roleDisplay');

const navAuthTrigger = document.getElementById('navAuthTrigger');
const navLogout = document.getElementById('navLogout');
const navRiseDishonored = document.getElementById('navRiseDishonored');
const menuDrop = document.getElementById('menuDrop');
const dropdownMenu = document.getElementById('dropdownMenu');
const mobileNavUser = document.getElementById('mobileNavUser');
const mobileNavRiseDishonored = document.getElementById('mobileNavRiseDishonored');
const mobileNavLogout = document.getElementById('mobileNavLogout');
const welcomeUserDisplay = document.getElementById('welcomeUserDisplay');

const loginSection = document.getElementById('login-section');
const riseDishonoredPage = document.getElementById('rise-dishonored-page');

function generateRandomCode() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function displayOwnerCode() {
  const code = generateRandomCode();
  roleDisplay.textContent = `2FA Backup Code: ${code}`;
  regenerateBtn.style.display = 'block';
}

// Page nav
function showPage(pageId) {
  loginSection.style.display = 'none';
  riseDishonoredPage.style.display = 'none';
  document.querySelectorAll('#navbar-main > li > a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('#dropdownMenu a').forEach(a => a.classList.remove('active'));
  
  if (pageId === 'login-section') {
    loginSection.style.display = 'block';
  } else {
    riseDishonoredPage.style.display = 'block';
    if (pageId === 'rise-dishonored-page') {
      navRiseDishonored.classList.add('active');
      mobileNavRiseDishonored.classList.add('active');
    }
  }
  dropdownMenu.classList.remove('show');
  document.getElementById('authMenuDropdown').classList.remove('show');
}

// Menu interactions
menuDrop.addEventListener('click', e => {
  e.preventDefault();
  dropdownMenu.classList.toggle('show');
});
window.addEventListener('click', e => {
  if (!menuDrop.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('show');
  }
});
navAuthTrigger.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('authMenuDropdown').classList.toggle('show');
});
window.addEventListener('click', e => {
  if (!navAuthTrigger.contains(e.target) && !document.getElementById('authMenuDropdown').contains(e.target)) {
    document.getElementById('authMenuDropdown').classList.remove('show');
  }
});

// Navigation actions
navRiseDishonored.addEventListener('click', e => { e.preventDefault(); showPage('rise-dishonored-page'); });
mobileNavRiseDishonored.addEventListener('click', e => { e.preventDefault(); showPage('rise-dishonored-page'); });
mobileNavLogout.addEventListener('click', e => {
  e.preventDefault();
  signOut(auth).catch(err => alert('Logout failed: ' + err.message));
});
document.getElementById('mobileNavUser').addEventListener('click', e => { e.preventDefault(); showPage('login-section'); });
navLogout.addEventListener('click', e => {
  e.preventDefault();
  signOut(auth).catch(err => alert('Logout failed: ' + err.message));
});

// Auth state monitoring
onAuthStateChanged(auth, user => {
  if (user) {
    statusEl.textContent = `Logged in as: ${user.email}`;
    loginBtn.style.display = 'none';
    emailInput.style.display = 'none';
    passwordInput.style.display = 'none';

    navAuthTrigger.textContent = user.email;
    navLogout.style.display = 'block';
    mobileNavLogout.style.display = 'block';
    mobileNavUser.textContent = user.email;

    welcomeUserDisplay.textContent = `Welcome, ${user.email.split('@')[0]}!`;
    welcomeUserDisplay.style.display = 'block';

    showPage('rise-dishonored-page');

    if (user.email === 'gogo.lindor@gmail.com') {
      displayOwnerCode();
    } else {
      const roles = {
        "admin1@example.com": "Admin",
        "staff1@example.com": "Staff",
        "moderator@example.com": "Moderator"
      };
      roleDisplay.textContent = `Welcome ${roles[user.email] || 'User'}`;
      regenerateBtn.style.display = 'none';
    }
  } else {
    statusEl.textContent = 'Not logged in';
    loginBtn.style.display = 'block';
    emailInput.style.display = 'block';
    passwordInput.style.display = 'block';
    roleDisplay.textContent = '';
    regenerateBtn.style.display = 'none';

    navAuthTrigger.textContent = 'Login';
    navLogout.style.display = 'none';
    mobileNavLogout.style.display = 'none';
    mobileNavUser.textContent = 'Login / User Info';
    welcomeUserDisplay.style.display = 'none';

    showPage('login-section');
  }
});

// Login & regenerate
loginBtn.addEventListener('click', () => {
  const email = emailInput.value.trim(), pass = passwordInput.value;
  if (!email || !pass) return alert('Please enter email and password.');
  signInWithEmailAndPassword(auth, email, pass).catch(err => alert('Login failed: ' + err.message));
});

regenerateBtn.addEventListener('click', () => {
  displayOwnerCode();
});
