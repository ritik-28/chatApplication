const loginform = document.querySelector(".loginform");
const emailno = document.querySelector(".emailno");
const passno = document.querySelector(".passno");

loginform.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const signinObject = {
      email: `${e.target.emaillogin.value}`,
      password: `${e.target.passwordlogin.value}`,
    };
    const res = await axios.post(
      "http://34.238.254.129:3000/user/signin",
      signinObject
    );
    localStorage.setItem("token", res.data);
    window.location.href = "chat.html";
  } catch (err) {
    if (err.response.data == "user not found") {
      emailno.style.display = "block";
    } else if (err.response.data == "User is not authorized") {
      passno.style.display = "block";
    }
  }
});
