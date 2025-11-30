const projectToken = localStorage.getItem("token");
if (!projectToken) {
  window.location.href = "/login.html";
}

async function loadAdminProjects() {
  const res = await fetch("/api/projects");
  const data = await res.json();

  const container = document.getElementById("adminProjectList");
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
        <p>${item.techStack || ""}</p>
        ${
          item.link
            ? `<a href="${item.link}" target="_blank" class="nav-btn">View Project</a>`
            : ""
        }
        ${
          item.fileUrl
            ? `<a href="${item.fileUrl}" target="_blank" class="nav-btn">View File</a>`
            : ""
        }
        <button class="nav-btn danger-btn" onclick="deleteProject('${item._id}')">
          Delete
        </button>
      </div>
    `
    )
    .join("");
}

async function deleteProject(id) {
  if (!confirm("Delete this project?")) return;

  await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    headers: { Authorization: projectToken }
  });

  loadAdminProjects();
}

document.getElementById("projectForm").onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { Authorization: projectToken },
    body: formData
  });

  if (res.ok) {
    e.target.reset();
    loadAdminProjects();
  }
};

loadAdminProjects();
