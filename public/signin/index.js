const signinEmail = document.getElementById("signin_email");
const signinPassword = document.getElementById("signin_password");
const signinButton = document.getElementById("login_btn_move");

signinButton.addEventListener("click", async () => {
  const email = signinEmail.value;
  const password = signinPassword.value;
  try {
    const signinResult = await fetch("/api/user/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (signinResult.ok) {
      const result = await signinResult.json();
      console.log("로그인 성공", result);

      //local에 token 저장
      localStorage.setItem("token", result.token);
      window.location.href = "http://localhost:8000/main/";
    } else {
      alert("(!)로그인 오류");
    }
  } catch (err) {
    console.log(err);
    alert("(!)로그인 오류");
  }
});
