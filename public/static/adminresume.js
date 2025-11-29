// Load existing resume on page load
async function loadResume() {
  const res = await fetch("/api/resume", {
    headers: { Authorization: localStorage.getItem("token") }
  });
console.log("adminResume.js LOADED");

  const data = await res.json();

  const status = document.getElementById("resumeStatus");
  const delBtn = document.getElementById("deleteResumeBtn");

  if (data.resumeUrl) {
    localStorage.setItem("resumeUrl", data.resumeUrl);

    status.innerHTML = `
      <a href="${data.resumeUrl}" class="nav-btn" target="_blank">View Resume</a>
    `;
    delBtn.style.display = "block";
  } else {
    status.innerHTML = "No resume uploaded.";
    delBtn.style.display = "none";
  }
}

// Upload resume
document.getElementById("resumeForm").onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const res = await fetch("/api/resume", {
    method: "POST",
    body: formData,
    headers: { Authorization: localStorage.getItem("token") }
  });

  const data = await res.json();

  localStorage.setItem("resumeUrl", data.resumeUrl);

  document.getElementById("resumeStatus").innerHTML =
    `<a href="${data.resumeUrl}" class="nav-btn" target="_blank">View Resume</a>`;

  document.getElementById("deleteResumeBtn").style.display = "block";
};

// Delete resume
document.getElementById("deleteResumeBtn").onclick = async () => {
  if (!confirm("Delete resume?")) return;

  await fetch("/api/resume", {
    method: "DELETE",
    headers: { Authorization: localStorage.getItem("token") }
  });

  localStorage.removeItem("resumeUrl");

  document.getElementById("resumeStatus").innerHTML = "Resume deleted.";
  document.getElementById("deleteResumeBtn").style.display = "none";
};

// Init
loadResume();
