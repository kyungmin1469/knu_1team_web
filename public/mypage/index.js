document.addEventListener("DOMContentLoaded", async () => {
  // 로컬 스토리지에서 토큰 가져오기
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인 필요");
    window.location.href = "/signin/index.html"; // 로그인 페이지로 리디렉션
    return;
  }
  //위 코드는 토큰을 프론트쪽에서만 받아온거니깐.... 유효한지 검사하려면 백으로 보내야함. signin/index.js의 try catch문 참고

  try {
    // 토큰 검증 요청
    const tokenVerificationResponse = await fetch("/api/user/verify-token", {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const verificationResult = await tokenVerificationResponse.json();

    if (tokenVerificationResponse.ok && verificationResult.valid) {
      // 토큰이 유효할 경우 사용자 정보 요청
      const userResponse = await fetch("/api/user/mypage", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (userResponse.ok) {
        const userInfo = await userResponse.json();
        document.getElementById("user_email").textContent = userInfo.email;
        document.getElementById("user_nickname").textContent =
          userInfo.nickname;
      } else {
        alert("회원 정보를 불러오는 데 오류가 발생했습니다.");
      }
    } else {
      alert("유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
      localStorage.removeItem("token");
      window.location.href = "/signin/index.html"; // 로그인 페이지로 리디렉션
    }
  } catch (err) {
    console.error(err);
    alert("서버와의 연결에 실패했습니다.");
  }
});
