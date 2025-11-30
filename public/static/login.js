const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");

loginForm.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const body = {
    username: formData.get("username"),
    password: formData.get("password")
  };

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    loginStatus.textContent = "Invalid credentials";
    return;
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  window.location.href = "/admin.html";
};
