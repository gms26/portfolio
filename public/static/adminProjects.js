async function loadProjectsAdmin() {
  const res = await fetch("/api/projects");
  const data = await res.json();

  const list = document.getElementById("projectAdminList");
  list.innerHTML = "";

  data.forEach(item => {
    list.innerHTML += `
      <div class="card">
        <h3>${item.title}</h3>
        
        ${item.pdfUrl ? `<a class="nav-btn" href="${item.pdfUrl}" target="_blank">PDF</a>` : ""}

        <button onclick="editProject('${item._id}')">Edit</button>
        <button onclick="deleteProject('${item._id}')">Delete</button>
      </div>
    `;
  });
}

async function deleteProject(id) {
  await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    headers: { Authorization: localStorage.getItem("token") }
  });
  loadProjectsAdmin();
}

async function editProject(id) {
  const res = await fetch("/api/projects");
  const data = await res.json();
  const item = data.find(x => x._id === id);

  document.querySelector("input[name='title']").value = item.title;
  document.querySelector("textarea[name='description']").value = item.description;
  document.querySelector("input[name='tech']").value = item.tech.join(", ");
  document.querySelector("input[name='github']").value = item.github;
  document.querySelector("input[name='live']").value = item.live;

  window.editingProjectId = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("projectForm").onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  let url = "/api/projects";
  let method = "POST";

  if (window.editingProjectId) {
    url = `/api/projects/${window.editingProjectId}`;
    method = "PUT";
  }

  await fetch(url, {
    method,
    body: formData,
    headers: { Authorization: localStorage.getItem("token") }
  });

  e.target.reset();
  window.editingProjectId = null;
  loadProjectsAdmin();
};

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

loadProjectsAdmin();
