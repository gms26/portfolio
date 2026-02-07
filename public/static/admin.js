// Auto-select backend URL
const API_BASE = location.hostname === "localhost"
  ? "http://localhost:10000"          // Local backend
  : "https://portfolio-backend.onrender.com";  // Render backend URL

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login.html";
}

async function loadAdminAchievements() {
  const res = await fetch("/api/achievements");
  const data = await res.json();

  const container = document.getElementById("adminAchievementList");
  if (!container) return;

  if (!data.length) {
    container.innerHTML = "<p>No achievements yet.</p>";
    return;
  }

  container.innerHTML = data
    .map(
      (item) => `
      <div class="card">
        <h3>${item.title}</h3>
        <p>${item.description || ""}</p>
        <p>${item.type || ""}</p>
        ${
          item.fileUrl
            ? `<a href="${item.fileUrl}" target="_blank" class="nav-btn">View File</a>`
            : ""
        }
        <button class="nav-btn danger-btn" onclick="deleteAchievement('${item._id}')">
          Delete
        </button>
      </div>
    `
    )
    .join("");
}

async function deleteAchievement(id) {
  if (!confirm("Delete this achievement?")) return;

  await fetch(`/api/achievements/${id}`, {
    method: "DELETE",
    headers: { Authorization: token }
  });

  loadAdminAchievements();
}

document.getElementById("achievementForm").onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const res = await fetch("/api/achievements", {
    method: "POST",
    headers: { Authorization: token },
    body: formData
  });

  if (res.ok) {
    e.target.reset();
    loadAdminAchievements();
  }
};

loadAdminAchievements();
