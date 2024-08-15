document.addEventListener("DOMContentLoaded", function () {
  let slider = document.querySelector(".slider .list");
  let items = document.querySelectorAll(".slider .list .item");
  let next = document.getElementById("next");
  let prev = document.getElementById("prev");
  let dots = document.querySelectorAll(".slider .dots li");

  let lengthItems = items.length;
  let active = 0;
  let refreshInterval;

  function moveSlide(step) {
    active = (active + step + lengthItems) % lengthItems;
    reloadSlider();
  }

  function reloadSlider() {
    slider.style.transform = `translateX(-${active * 100}%)`;

    // Update dots
    let lastActiveDot = document.querySelector(".slider .dots li.active");
    if (lastActiveDot) lastActiveDot.classList.remove("active");
    dots[active].classList.add("active");

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
  reloadSlider();

  window.addEventListener("resize", reloadSlider);
});

// 로그인 상태화면 구현
const div = document.createElement("div");
const span = document.createElement("span");
const p = document.createElement("p");
