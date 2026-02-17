const form = document.getElementById("authForm");
const message = document.getElementById("message");
const registerBtn = document.getElementById("registerBtn");

let isRegister = false;

registerBtn.addEventListener("click", () => {
  isRegister = !isRegister;
  registerBtn.textContent = isRegister ? "I already have an account" : "Sign up";
  form.querySelector("button").textContent = isRegister ? "Register" : "Log in";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const url = isRegister ? "/api/register" : "/api/login";

  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    window.location.href = "/location/location.html";
  } else {
    message.textContent = data.error;
    message.style.color = "red";
  }
});
