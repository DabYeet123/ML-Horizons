let googleID = getGoogleID("googleID");

function toggleMenu() {
    const dropdown = document.getElementById('dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function toggleProfile() {
    const profile = document.getElementById('profile');
    profile.style.display = profile.style.display === 'block' ? 'none' : 'block';
}

async function loadHeader(){
    await fetch('../../dropDown/dropDownHeader.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('TopHeader').innerHTML = data;
      });
      const dropdown = document.getElementById('dropdown');
    addMenu();
    addProfile();
}

function getGoogleID(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

function addMenu(){
    const dropdown = document.getElementById('dropdown');
    const a1 = document.createElement('a');
    const a2 = document.createElement('a');
    const a3 = document.createElement('a');
    const a4 = document.createElement('a');
    const a5 = document.createElement('a');
    a1.href = `../../Information/About Page/aboutPage.html?googleID=${encodeURIComponent(googleID)}`
    a2.href = `../../Information/Contacts Page/contactsPage.html?googleID=${encodeURIComponent(googleID)}`
    a3.href = `../../Information/Sources Page/sourcesPage.html?googleID=${encodeURIComponent(googleID)}`
    a4.href = `../../Canvas Page/canvasPage.html?googleID=${encodeURIComponent(googleID)}`
    a5.href = `../../Main Page/index.html?googleID=${encodeURIComponent(googleID)}`
    a1.innerHTML = "About";
    a2.innerHTML = "Contact";
    a3.innerHTML = "Source";
    a4.innerHTML = "Canvas";
    a5.innerHTML = "Chat Bot";
    dropdown.appendChild(a1);
    dropdown.appendChild(a2);
    dropdown.appendChild(a3);
    dropdown.appendChild(a4);
    dropdown.appendChild(a5);
}

function addProfile(){
    const profile = document.getElementById('profile');
    const a1 = document.createElement('a');
    const a2 = document.createElement('button');
    a1.href = `../../Information/Profile Page/profilePage.html?googleID=${encodeURIComponent(googleID)}`
    a2.onclick = function() {
        window.location.href = "../../Login Page/loginPage.html";
    }
    a1.innerHTML = "Profile";
    a2.innerHTML = "Logout";
    a2.id = "logout";
    profile.appendChild(a1);
    profile.appendChild(a2);
}

window.addEventListener('click', function(event) {
    const dropdown = document.getElementById('dropdown');
    const profile = document.getElementById('profile');
    const menuButton = document.querySelector('.menu-button');
    const profileButton = document.querySelector('.profile-button');
    if (!dropdown.contains(event.target) && !menuButton.contains(event.target)) {
        dropdown.style.display = 'none';
    }
    if (!profile.contains(event.target) && !profileButton.contains(event.target)) {
        profile.style.display = 'none';
    }
});
loadHeader();

