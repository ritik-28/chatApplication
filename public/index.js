const signupform = document.querySelector(".signupform");
const emailPresent = document.querySelector(".emailpresent");

signupform.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const signupObject = {
      name: `${e.target.firstName.value} ${e.target.lastName.value}`,
      email: `${e.target.emailAddress.value}`,
      phone: `${e.target.phoneNumber.value}`,
      password: `${e.target.password.value}`,
    };
    const res = await axios.post(
      "http://localhost:3000/user/signup",
      signupObject
    );
  } catch (err) {
    if (err.response.data == "email is already present") {
      emailPresent.style.display = "block";
      setTimeout(() => {
        emailPresent.style.display = "none";
      }, 5000);
    }
  }
});
