let allAchievements = [];
let allProjects = [];

/* ===============================
   LOAD ACHIEVEMENTS
=============================== */
async function loadAchievements() {
  const res = await fetch("/api/achievements");
  allAchievements = await res.json();
  applyFilters();
}

/* ===============================
   SEARCH + FILTERS
=============================== */
function applyFilters() {
  const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const type = document.getElementById("typeFilter")?.value || "";
  const sort = document.getElementById("sortFilter")?.value || "newest";

  let data = [...allAchievements];

  if (search.trim() !== "") {
    data = data.filter(item =>
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.skills.join(", ").toLowerCase().includes(search)
    );
  }

  if (type !== "") {
    data = data.filter(item => item.type === type);
  }

  if (sort === "newest") {
    data = data.sort((a, b) => b._id.localeCompare(a._id));
  } else {
    data = data.sort((a, b) => a._id.localeCompare(b._id));
  }

  displayAchievements(data);
}

/* ===============================
   DISPLAY ACHIEVEMENTS
=============================== */
function displayAchievements(data) {
  const list = document.getElementById("achievementList");
  if (!list) return;

  list.innerHTML = "";

  data.forEach(item => {
    list.innerHTML += `
<div class="card fade-in">
        ${item.imageUrl ? `<img src="${item.imageUrl}">` : ""}
        ${item.pdfUrl ? `<a href="${item.pdfUrl}" class="nav-btn" target="_blank">Open PDF</a>` : ""}

        <h3>${item.title}</h3>
        <p>${item.description}</p>

        <small>${item.date} • ${item.type}</small><br>
        <small>${item.skills.join(", ")}</small>
      </div>
    `;
  });
}

document.addEventListener("input", applyFilters);

/* ===============================
   LOAD PROJECTS
=============================== */
async function loadProjects() {
  const res = await fetch("/api/projects");
  allProjects = await res.json();

  const list = document.getElementById("projectList");
  if (!list) return; // FIX: avoid errors

  list.innerHTML = "";

  allProjects.forEach(item => {
    list.innerHTML += `
      <div class="card">
        ${item.imageUrl ? `<img src="${item.imageUrl}">` : ""}
        ${item.pdfUrl ? `<a href="${item.pdfUrl}" class="nav-btn" target="_blank">Docs</a>` : ""}

        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <small>${item.tech.join(", ")}</small>

        <div style="margin-top:10px;">
          ${item.github ? `<a href="${item.github}" class="nav-btn" target="_blank">GitHub</a>` : ""}
          ${item.live ? `<a href="${item.live}" class="nav-btn" target="_blank">Live</a>` : ""}
        </div>
      </div>
    `;
  });
}

/* ===============================
   INIT
=============================== */
loadAchievements();
loadProjects();
/* =======================================
   THEME TOGGLE
======================================= */

const themeBtn = document.getElementById("themeToggle");

function applyTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  document.body.classList.toggle("light", theme === "light");
  themeBtn.textContent = theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode";
}

themeBtn.addEventListener("click", () => {
  const current = localStorage.getItem("theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme();
});

applyTheme();

const resumeDiv = document.getElementById("resumeDisplay");
const resumeUrl = localStorage.getItem("resumeUrl");

if (resumeUrl) {
  resumeDiv.innerHTML = `
    <a href="${resumeUrl}" class="nav-btn" target="_blank">Download Resume</a>
  `;
}
async function loadResumeHomepage() {
  const res = await fetch("/api/resume");
  const data = await res.json();

  if (data.resumeUrl) {
    document.getElementById("resumeDisplay").innerHTML = `
      <a href="${data.resumeUrl}" class="nav-btn" target="_blank">Download Resume</a>
    `;
  }
}

loadResumeHomepage();
