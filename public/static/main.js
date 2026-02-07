// THEME TOGGLE
// Auto-select backend URL
const API_BASE = location.hostname === "localhost"
  ? "http://localhost:10000"          // Local backend
  : "https://portfolio-backend.onrender.com";  // Render backend URL

const toggleBtn = document.getElementById("themeToggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleBtn.textContent = document.body.classList.contains("dark")
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";
  });
}

// LOAD ACHIEVEMENTS & PROJECTS
async function loadAchievements() {
  const res = await fetch("/api/achievements");
  const data = await res.json();

  window._allAchievements = data;
  renderAchievements(data);
}

function renderAchievements(list) {
  const container = document.getElementById("achievementList");
  if (!container) return;

  if (!list.length) {
    container.innerHTML = "<p>No achievements yet.</p>";
    return;
  }

  container.innerHTML = list
    .map(
      (item) => `
      <div class="card">
        <h3>${item.title}</h3>
        <p class="card-type">${item.type || ""}</p>
        <p>${item.description || ""}</p>
        ${
          item.fileUrl
            ? `<a href="${item.fileUrl}" target="_blank" class="nav-btn" style="margin-top:10px;">View File</a>`
            : ""
        }
      </div>
    `
    )
    .join("");
}

// Filters for achievements
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const sortFilter = document.getElementById("sortFilter");

function applyFilters() {
  let list = window._allAchievements || [];

  const q = (searchInput?.value || "").toLowerCase();
  const type = typeFilter?.value || "";
  const sort = sortFilter?.value || "newest";

  if (q) {
    list = list.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
    );
  }

  if (type) {
    list = list.filter((a) => a.type === type);
  }

  list = list.sort((a, b) =>
    sort === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  renderAchievements(list);
}

if (searchInput) searchInput.addEventListener("input", applyFilters);
if (typeFilter) typeFilter.addEventListener("change", applyFilters);
if (sortFilter) sortFilter.addEventListener("change", applyFilters);

async function loadProjects() {
  const res = await fetch("/api/projects");
  const data = await res.json();

  const container = document.getElementById("projectList");
  if (!container) return;

  if (!data.length) {
    container.innerHTML = "<p>No projects yet.</p>";
    return;
  }

  container.innerHTML = data
    .map(
      (item) => `
      <div class="card">
        <h3>${item.title}</h3>
        <p>${item.description || ""}</p>
        <p><strong>${item.techStack || ""}</strong></p>
        ${
          item.link
            ? `<a href="${item.link}" target="_blank" class="nav-btn" style="margin-top:10px;">View Project</a>`
            : ""
        }
        ${
          item.fileUrl
            ? `<a href="${item.fileUrl}" target="_blank" class="nav-btn" style="margin-top:10px;">View File</a>`
            : ""
        }
      </div>
    `
    )
    .join("");
}

// Resume on public page
async function loadResumePublic() {
  try {
    const res = await fetch("/api/resume");
    const data = await res.json();

    const resumeBtn = document.getElementById("resumeBtn");
    const resumeDisplay = document.getElementById("resumeDisplay");

    if (data.resumeUrl) {
      if (resumeBtn) {
        resumeBtn.style.display = "inline-block";
        resumeBtn.href = data.resumeUrl;
      }
      if (resumeDisplay) {
        resumeDisplay.innerHTML = `
          <div class="resume-box">
            <p>Your resume is available:</p>
            <a href="${data.resumeUrl}" target="_blank" class="nav-btn">
              Open Resume (PDF)
            </a>
          </div>
        `;
      }
    } else {
      if (resumeDisplay) {
        resumeDisplay.innerHTML = "<p>No resume uploaded yet.</p>";
      }
    }
  } catch (err) {
    console.log("Resume load error:", err);
  }
}

loadAchievements();
loadProjects();
loadResumePublic();
