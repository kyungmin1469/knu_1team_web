document.addEventListener("DOMContentLoaded", function () {
  let slider = document.querySelector(".slider .list");
  let items = document.querySelectorAll(".slider .list .item");
  let next = document.getElementById("next");
  let prev = document.getElementById("prev");
  let dots = document.querySelectorAll(".slider .dots li");

  let lengthItems = items.length;
  let active = 0;
  let refreshInterval;
  // [ 1,2,3,4]
  // [{id:1 ,stock:3} ,{id:1 ,stock:3} ,{id:1 ,stock:3} ]
  const imageName = [
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
    "image4.jpg",
    "image5.jpg",
  ];

  // id 슬라이더 이미지를 가져오는 함수
  async function fetchSlidersById() {
    const sliders = [];
    for (const filename of imageName) {
      const response = await fetch(`/api/slider/${filename}`); // 특정 이미지 ID로 API 요청
      const data = await response.json();
      sliders.push(data.data); // 데이터 배열에 추가
    }
    displaySlides(sliders); // 모든 이미지를 displaySlides에 전달
  }

  function displaySlides(sliders) {
    slider.innerHTML = ""; // 기존 슬라이드 초기화
    dots.forEach((dot) => dot.remove()); // 기존 점 초기화

    sliders.forEach((sliderItem, index) => {
      const item = document.createElement("div");
      item.className = "item";
      item.innerHTML = `<img src="${sliderItem.imageUrl}" alt="${sliderItem.caption}" />`;
      slider.appendChild(item);
      // 점 추가
      const dot = document.createElement("li");
      if (index === 0) dot.classList.add("active");
      dots[0].parentNode.appendChild(dot);
    });

    lengthItems = sliders.length; // 새로운 슬라이드 개수 업데이트
    reloadSlider(); // 슬라이드 초기화
  }

  function moveSlide(step) {
    active = (active + step + lengthItems) % lengthItems;
    reloadSlider();
  }

  function reloadSlider() {
    slider.style.transform = `translateX(-${active * 100}%)`;

    // Update dots
    let lastActiveDot = document.querySelector(".slider .dots li.active");
    if (lastActiveDot) lastActiveDot.classList.remove("active");
    if (dots[active]) {
      dots[active].classList.add("active");
    }

    // Reset auto-advance interval
    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
      moveSlide(1);
    }, 3000);
  }

  refreshInterval = setInterval(() => {
    moveSlide(1);
  }, 3000);

  next.addEventListener("click", () => moveSlide(1));
  prev.addEventListener("click", () => moveSlide(-1));

  dots.forEach((li, key) => {
    li.addEventListener("click", () => {
      active = key;
      reloadSlider();
    });
  });

  // Initial load
  fetchSlidersById();
  window.addEventListener("resize", reloadSlider);
});
const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token"); // 로컬 저장소에서 토큰 가져오기
    if (!token) {
    }
    // profileController와 통신으로 profileData 가져오기
    const response = await fetch("http://localhost:8000/api/user/me", {
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
      console.log("유효하지 않은 토큰 값");
      window.location.href = "http://localhost:8000/signin";
    }
  } catch (error) {
    console.error("An error occurred while fetching profile data:", error);
    return null;
  }
};
const renderProfile = async () => {
  const profileData = await fetchProfile();
  const loginContainer = document.getElementById("loginContainer");
  const profileInfo = document.getElementById("profileInfo");

  if (profileData) {
    loginContainer.style.dispaly = "none";
    profileInfo.innerHTML = `
      <div>Email: ${profileData.email}</div>
      <div>Nickname: ${profileData.nickname}</div>
      <div id="editProfileBtn" class="btn">회원정보 수정</div>
      <div id="logoutBtn" class="btn">로그아웃</div>
    `;
    profileInfo.style.dispaly = "block";
    // 버튼 클릭 이벤트 처리
    document.getElementById("editProfileBtn").addEventListener("click", () => {
      window.location.href = "/edit-profile"; // 수정 페이지 URL로 변경
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token"); // 토큰 삭제
      window.location.href = "/login"; // 로그인 페이지로 리디렉션
    });
  } else {
    profileInfo.innerHTML = `
      <div>Unable to fetch profile data. Please try again later.</div>`;
    loginContainer.style.display = "none"; // 에러 메시지 표시
  }
};

renderProfile();

const loginPageMove = document.getElementById("loginBtnMove");

loginPageMove.addEventListener("click", function () {
  window.location.href = "http://localhost:8000/signin/";
});

const div = document.createElement("div");
const span = document.createElement("span");
const p = document.createElement("p");
