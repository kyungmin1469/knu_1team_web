document.addEventListener("DOMContentLoaded", function () {
  let slider = document.querySelector(".slider .list");
  let items = document.querySelectorAll(".slider .list .item");
  let next = document.getElementById("next");
  let prev = document.getElementById("prev");
  let dots = document.querySelectorAll(".slider .dots li");
  const loginDiv1 = document.querySelector(".loginDIv1");
  const loginDiv2 = document.querySelector(".loginDIv2");
  const loginDIv3 = document.querySelector(".loginDIv3");
  const registarMove = document.getElementById(".registarMove");

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

  // Login page redirection
  const loginPageMove = document.getElementById("loginBtnMove");

  loginPageMove.addEventListener("click", function () {
    window.location.href = "http://localhost:8000/signin/";
  });

  // Product list rendering
  const productListWrapper = document.getElementById("product_list_wrapper");

  const renderProductList = async () => {
    const productList = await fetchProductList();

    if (!productList || productList.length === 0) {
      console.log("Empty productList");
      return;
    }

    productList.data.forEach((v) => {
      const itemElem = document.createElement("div");
      itemElem.classList.add("product-item");
      itemElem.innerHTML = `
        <div>
            <img src="${v.imgUrl}" alt="${v.title}" />
          </div>
          <div>${v.title}</div>
          <div>가격: ${v.price}원</div>
          <div>[상세설명] ${v.description}</div>
          <div>재고수량: ${v.stock}</div>
        `;
      itemElem.addEventListener("click", () => {
        window.location.href = `/detail/?id=${v._id}`;
      });
      productListWrapper.append(itemElem);
    });
  };

  const fetchProductList = async () => {
    const fetchResult = await fetch("/api/product", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const fetchData = await fetchResult.json();
    return fetchData;
  };

  renderProductList();

  // Profile fetching and rendering
  const fetchProfile_mypage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      const response = await fetch("http://localhost:8000/api/user/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userToken: token }),
      });

      const data = await response.json();

      if (data.isVerify) {
        return data;
      } else {
        throw new Error("유효하지 않은 토큰입니다.");
      }
    } catch (error) {
      console.error("An error occurred while fetching profile data:", error);
      return null;
    }
  };

  const renderProfile = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const profileData = await fetchProfile_mypage();
      if (profileData) {
        loginDiv1.textContent = profileData.email;
        loginDiv2.textContent = profileData.nickname;
        loginDIv3.textContent = "로그아웃";

        // 로그아웃 클릭 이벤트 리스너 추가
        loginDIv3.addEventListener("click", async () => {
          if (loginDIv3.textContent === "로그아웃") {
            localStorage.clear(); // 로컬 스토리지에서 모든 항목을 제거
            window.location.href = "/main"; // 로그인 페이지로 리디렉션
          }
        });
      }
    }
  };

  renderProfile();

  registarMove.addEventListener("click", async () => {
    window.location.href = "http://localhost:8000/signup/";
  });
});
