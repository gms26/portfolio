const resumeToken = localStorage.getItem("token");
if (!resumeToken) {
  window.location.href = "/login.html";
}

// Load existing resume
async function loadResume() {
  const res = await fetch("/api/resume");
  const data = await res.json();

  const status = document.getElementById("resumeStatus");
  const delBtn = document.getElementById("deleteResumeBtn");

  if (data.resumeUrl) {
    status.innerHTML = `
      <a href="${data.resumeUrl}" class="nav-btn" target="_blank">View Resume</a>
    `;
    delBtn.style.display = "block";
  } else {
    status.textContent = "No resume uploaded.";
    delBtn.style.display = "none";
  }
}

// Upload resume
document.getElementById("resumeForm").onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const res = await fetch("/api/resume", {
    method: "POST",
    headers: { Authorization: resumeToken },
    body: formData
  });

  const data = await res.json();

  document.getElementById("resumeStatus").innerHTML =
    `<a href="${data.resumeUrl}" class="nav-btn" target="_blank">View Resume</a>`;

  document.getElementById("deleteResumeBtn").style.display = "block";
};

// Delete resume
document.getElementById("deleteResumeBtn").onclick = async () => {
  if (!confirm("Delete resume?")) return;

  await fetch("/api/resume", {
    method: "DELETE",
    headers: { Authorization: resumeToken }
  });

  document.getElementById("resumeStatus").textContent = "Resume deleted.";
  document.getElementById("deleteResumeBtn").style.display = "none";
};

loadResume();
