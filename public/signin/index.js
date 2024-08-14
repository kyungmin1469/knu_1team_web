const signinEmail = document.getElementById("signin_email");
const signinPassword = document.getElementById("signin_password");
const signinButton = document.getElementById("signin_button");

//클릭했을 때 입력받은 이메일과 패스워드를 전송해야한다. 그 부분
signinButton.addEventListener("click", async () => {
  const email = signinEmail.value;
  const password = signinPassword.value;
  //위 두 가지를 controller로 보내야한다. fetch 쓸 것이므로 async, await 사용

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
      console.log("로그인 성공", result);
      localStorage.setItem("token", result.token);
      window.open("http://localhost:8000/mypage/");
    } else {
      alert("(!) 로그인 오류");
    }
  } catch {}
});
