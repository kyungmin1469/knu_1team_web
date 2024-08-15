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

const loginPageMove = document.getElementById("loginBtnMove");

loginPageMove.addEventListener("click", function () {
  window.location.href = "http://localhost:8000/registar/";
});

const div = document.createElement("div");
const span = document.createElement("span");
const p = document.createElement("p");
