document.getElementById("loginForm").onsubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
        document.getElementById("loginError").innerText = data.message;
        return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "/admin.html";
};
