document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.querySelector("input[placeholder='Username']");
  const passwordInput = document.querySelector("input[placeholder='Password']");
  const signinButton = document.querySelector(".login-button-wrap button");

  signinButton.addEventListener("click", async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      // 사용자 입력값을 사용해 POST 요청을 보냄
      const signinResult = await fetch("/api/user/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (signinResult.ok) {
        // 응답을 JSON으로 변환
        const result = await signinResult.json();
        console.log("로그인 성공", result);

        // 서버에서 받은 토큰이 유효한지 확인
        if (result.token) {
          // 토큰을 localStorage에 저장
          localStorage.setItem("token", result.token);

          // /mypage/ 페이지로 리디렉션
          window.location.href = "http://localhost:8000/mypage/";
        } else {
          alert("(!)유효하지 않은 토큰입니다.");
        }
      } else {
        alert("(!)로그인 오류");
      }
    } catch (err) {
      // 요청 중 에러가 발생했을 때 콘솔에 에러를 출력하고 사용자에게 알림
      console.error(err);
      alert("(!)로그인 오류");
    }
  });
});
