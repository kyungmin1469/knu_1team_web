const fetchProfile_mypage = async () => {
  try {
    const token = localStorage.getItem("token"); // 로컬 저장소에서 토큰 가져오기
    // profileController와 통신으로 profileData 가져오기
    const response = await fetch("http://localhost:8000/api/user/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
      },
    });
    // res.json({data: true})
    // 응답이 성공적일 때

    const data = await response.json();

    console.log(data);
    return data;
  } catch (error) {
    console.error("An error occurred while fetching profile data:", error);
    return "null";
  }
};

const fetchProfileWrapper = document.getElementById("test");

const renderProfile = async () => {
  // 프로필 데이터 가져오기
  const profileData = await fetchProfile_mypage();
  if (profileData) {
    console.log({ profileData });
    // 프로필 정보를 담을 div 생성
    const itemElem = document.createElement("div");
    itemElem.innerHTML = `
      <div>Email: ${profileData.user.payload.email}</div>
      <div>Nickname: ${profileData.user.nickname}</div>
    `;
    fetchProfileWrapper.append(itemElem);
  } else {
    // 데이터가 없거나 오류가 발생했을 때의 처리를 추가
    const errorElem = document.createElement("div");
    errorElem.innerHTML = `
      <div>Unable to fetch profile data. Please try again later.</div>
    `;
    fetchProfileWrapper.append(errorElem);
  }
};

// renderProfile 함수를 호출하여 프로필 데이터 렌더링
renderProfile();
