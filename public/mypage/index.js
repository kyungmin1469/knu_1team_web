// 페이지가 로드될 때 실행되는 코드
window.addEventListener("DOMContentLoaded", async () => {
  // 로컬 스토리지에서 토큰 가져오기
  const userToken = await localStorage.getItem("token");

  if (!token) {
    console.error("토큰이 없습니다.");
    // 필요에 따라 사용자에게 알리거나 로그인 페이지로 리다이렉트
    return;
  }

  try {
    const response = await fetch("api/user/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userToken }), // 필요한 경우 추가 데이터 전송
    });

    if (response.isVerify) {
      // 인증이 성공한 경우
      console.log("인증 성공:", data);
      document.getElementById("email").textContent = response.email;
      document.getElementById("nickname").textContent = response.nickname;
      // 사용자 정보를 기반으로 페이지 내용을 업데이트
    } else {
      // 인증이 실패한 경우
      console.error(response.message);
      window.location.href = "/signin";
      // 결과 메세지와 함께 signin페이지로 리다이렉트
    }
  } catch (error) {
    console.error("서버와의 통신 중 오류 발생:", error);
  }
});
