const loginform = document.querySelector(".loginform");

loginform.addEventListener("submit", async (e) => {
  e.preventDefault();
  const signinObject = {
    email: `${e.target.emaillogin.value}`,
    password: `${e.target.passwordlogin.value}`,
  };
  const response = await axios.post(
    "http://localhost:3000/user/signin",
    signinObject
  );
});
