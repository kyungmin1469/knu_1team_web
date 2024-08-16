document
  .getElementById("submitBtn")
  .addEventListener("click", async (event) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    const nickname = document.getElementById("nickname").value;

    // 서버에 닉네임 수정 요청
    try {
      const token = localStorage.getItem("token"); // 로컬 저장소에서 토큰 가져오기
      const response = await fetch("/api/user/edit-profile", {
        // URL 수정
        method: "PATCH", // PATCH 메서드 사용
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 토큰 포함
        },
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();

      if (data.isVerify) {
        // 서버 응답 확인 수정
        document.getElementById("message").textContent =
          "닉네임이 성공적으로 수정되었습니다.";
        document.getElementById("message").style.color = "green";
      } else {
        throw new Error(data.message || "닉네임 수정에 실패했습니다.");
      }
    } catch (error) {
      document.getElementById("message").textContent = error.message;
    }
  });

document.getElementById("cancelBtn").addEventListener("click", () => {
  window.location.href = "/main"; // 메인 페이지로 리디렉션
});
