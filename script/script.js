// ... Firebase config and auth setup remain unchanged ...

// DOM references (no backupCodeEl anymore)
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const statusEl = document.getElementById('status');
const roleDisplay = document.getElementById('roleDisplay');

const navAuthTrigger = document.getElementById('navAuthTrigger');
const navLogout = document.getElementById('navLogout');
const navRise = document.getElementById('navRiseDishonored');
const menuDrop = document.getElementById('menuDrop');
const dropdownMenu = document.getElementById('dropdownMenu');
const mobileUser = document.getElementById('mobileNavUser');
const mobileRise = document.getElementById('mobileNavRiseDishonored');
const mobileLogout = document.getElementById('mobileNavLogout');
const welcomeDisplay = document.getElementById('welcomeUserDisplay');

const loginSection = document.getElementById('login-section');
const risePage = document.getElementById('rise-dishonored-page');

function showPage(page) {
  loginSection.style.display = 'none';
  risePage.style.display = 'none';
  document.querySelectorAll('#navbar-main a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('#dropdownMenu a').forEach(a => a.classList.remove('active'));

  if (page === 'login') {
    loginSection.style.display = 'block';
  } else if (page === 'rise') {
    risePage.style.display = 'block';
    navRise.classList.add('active');
    mobileRise.classList.add('active');
  }

  dropdownMenu.classList.remove('show');
  document.getElementById('authMenuDropdown').classList.remove('show');
}

// Toggle menus
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

// Page nav
navRise.addEventListener('click', e => { e.preventDefault(); showPage('rise'); });
mobileRise.addEventListener('click', e => { e.preventDefault(); showPage('rise'); });
mobileUser.addEventListener('click', e => { e.preventDefault(); showPage('login'); });

navLogout.addEventListener('click', e => {
  e.preventDefault();
  signOut(auth);
});
mobileLogout.addEventListener('click', e => {
  e.preventDefault();
  signOut(auth);
});

// Auth
onAuthStateChanged(auth, user => {
  if (user) {
    statusEl.textContent = `Logged in as: ${user.email}`;
    emailInput.style.display = 'none';
    passwordInput.style.display = 'none';
    loginBtn.style.display = 'none';

    navAuthTrigger.textContent = user.email;
    navLogout.style.display = 'block';
    mobileLogout.style.display = 'block';
    mobileUser.textContent = user.email;

    welcomeDisplay.textContent = `Welcome, ${user.email.split('@')[0]}!`;
    welcomeDisplay.style.display = 'block';

    navRise.classList.remove('disabled');
    mobileRise.classList.remove('disabled');

    showPage('rise');
  } else {
    statusEl.textContent = 'Not logged in';
    emailInput.style.display = 'block';
    passwordInput.style.display = 'block';
    loginBtn.style.display = 'block';

    navAuthTrigger.textContent = 'Login';
    navLogout.style.display = 'none';
    mobileLogout.style.display = 'none';
    mobileUser.textContent = 'Login / User Info';

    welcomeDisplay.style.display = 'none';

    navRise.classList.add('disabled');
    mobileRise.classList.add('disabled');

    showPage('login');
  }
});

// Login
loginBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Please enter email and password.');
    return;
  }

  signInWithEmailAndPassword(auth, email, password).catch(err =>
    alert('Login failed: ' + err.message)
  );
});
