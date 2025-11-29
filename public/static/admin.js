/* =====================================================
   LOAD ACHIEVEMENTS
===================================================== */
async function loadAdminList() {
  const res = await fetch("/api/achievements");
  const data = await res.json();

  const list = document.getElementById("adminList");
  list.innerHTML = "";

  data.forEach(item => {
    list.innerHTML += `
      <div class="card fade-in">
        <h3>${item.title}</h3>

        ${item.imageUrl ? `<img src="${item.imageUrl}">` : ""}
        ${item.pdfUrl ? `<a class="nav-btn" href="${item.pdfUrl}" target="_blank">View PDF</a>` : ""}

        <p><small>${item.date} • ${item.type}</small></p>
        <p><small>${item.skills.join(", ")}</small></p>

        <button class="nav-btn" onclick="editItem('${item._id}')">Edit</button>
        <button class="nav-btn" onclick="deleteItem('${item._id}')">Delete</button>
      </div>
    `;
  });
}


/* =====================================================
   DELETE ACHIEVEMENT
===================================================== */
async function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  await fetch(`/api/achievements/${id}`, {
    method: "DELETE",
    headers: { Authorization: localStorage.getItem("token") }
  });

  loadAdminList();
}


/* =====================================================
   EDIT ACHIEVEMENT (PREFILL FORM)
===================================================== */
async function editItem(id) {
  const res = await fetch("/api/achievements");
  const data = await res.json();
  const item = data.find(x => x._id === id);
  if (!item) return alert("Item not found");

  document.querySelector("input[name='title']").value = item.title;
  document.querySelector("textarea[name='description']").value = item.description;
  document.querySelector("input[name='date']").value = item.date;
  document.querySelector("input[name='type']").value = item.type;
  document.querySelector("input[name='skills']").value = item.skills.join(", ");

  window.editingId = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =====================================================
   CREATE / UPDATE ACHIEVEMENT
===================================================== */
document.getElementById("achievementForm").onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  let url = "/api/achievements";
  let method = "POST";

  if (window.editingId) {
    url = `/api/achievements/${window.editingId}`;
    method = "PUT";
  }

  await fetch(url, {
    method,
    body: formData,
    headers: { Authorization: localStorage.getItem("token") }
  });

  e.target.reset();
  window.editingId = null;

  loadAdminList();
};


/* =====================================================
   RESUME UPLOAD (STEP 4 COMPLETE)
===================================================== */
document.getElementById("resumeForm").onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const res = await fetch("/api/resume", {
    method: "POST",
    body: formData,
    headers: { Authorization: localStorage.getItem("token") }
  });

  const data = await res.json();

  // Save resume URL locally
  localStorage.setItem("resumeUrl", data.resumeUrl);

  document.getElementById("resumeStatus").innerHTML =
  `<a href="${data.resumeUrl}" class="nav-btn" target="_blank">View Resume PDF</a>`;

document.getElementById("deleteResumeBtn").style.display = "inline-block";

  
};
// ============= DELETE RESUME =================
document.getElementById("deleteResumeBtn").onclick = async () => {
  if (!confirm("Are you sure you want to delete the resume?")) return;

  const res = await fetch("/api/resume", {
    method: "DELETE",
    headers: { Authorization: localStorage.getItem("token") }
  });

  const data = await res.json();

  // Clear UI + localStorage
  localStorage.removeItem("resumeUrl");
  document.getElementById("resumeStatus").innerHTML = "Resume deleted.";
  document.getElementById("deleteResumeBtn").style.display = "none";

  alert("Resume deleted successfully");
};


/* =====================================================
   LOGOUT
===================================================== */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}


/* =====================================================
   INITIAL LOAD
===================================================== */
loadAdminList();
// Show delete button if resume exists
const existingResume = localStorage.getItem("resumeUrl");
if (existingResume) {
  document.getElementById("resumeStatus").innerHTML =
    `<a href="${existingResume}" class="nav-btn" target="_blank">View Resume PDF</a>`;
  document.getElementById("deleteResumeBtn").style.display = "inline-block";
}
