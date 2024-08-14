const signinEmail = document.getElementById("signin_email");
const signinpassword = document.getElementById("signin_password");
const signinButton = document.getElementById("signin_button");

signinButton.addEventListener("click", async () => {
  const email = signinEmail.value;
  const password = signinpassword.value;
  try {
    const signinResult = await fetch("/api/user/signin", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (signinResult.ok) {
      const result = await signinResult.json();
      console.log(result);
      localStorage.setItem("token", result.token);
    } else {
      alert("(!)로그인 오류");
    }
  } catch (err) {
    console.log(err);
    alert("(!)로그인 오류");
  }
});
