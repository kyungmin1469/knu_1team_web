const fetchProfile_mypage = async () => {
  try {
    const token = localStorage.getItem("token"); // 로컬 저장소에서 토큰 가져오기
    if (!token) {
      throw new Error("토큰이 없습니다.");
    }
    // profileController와 통신으로 profileData 가져오기
    const response = await fetch("/api/user/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
      },
      body: JSON.stringify({ userToken: token }), // 토큰을 요청 본문에 포함
    });
    // res.json({data: true})
    // 응답이 성공적일 때

    const data = await response.json();

    if (data.isVerify) {
      console.log(data);
      return data;
    } else {
      throw new Error("유효하지 않은 토큰입니다.");
    }
  } catch (error) {
    console.error("An error occurred while fetching profile data:", error);
    return null;
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
      <div>Email: ${profileData.email}</div>
      <div>Nickname: ${profileData.nickname}</div>
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
