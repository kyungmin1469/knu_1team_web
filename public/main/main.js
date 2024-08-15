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

const loginPageMove = document.getElementById("loginBtnMove");

loginPageMove.addEventListener("click", function () {
  window.location.href = "http://localhost:8000/registar/";
});

const div = document.createElement("div");
const span = document.createElement("span");
const p = document.createElement("p");

//product JS

const productListWrapper = document.getElementById("product_list_wrapper");

const renderProductList = async () => {
  // 상품 리스트는 Array나 null이 옴
  const productList = await fetchProductList();

  if (!productList || productList.length === 0) {
    console.log("Empty productList");
    return;
  }

  //productList가 존재하는 경우 .append
  //v가 body가 되는 느낌
  productList.data.forEach((v) => {
    //div 클래스 가져왔고
    const itemElem = document.createElement("div");
    itemElem.classList.add("product-item"); // 상품 아이템에 클래스 추가
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

// const fetchProductList = async () => {
//   try {
//     const response = await fetch("/api/product");
//     const productList = await response.json();
//     return productList;
//   } catch (error) {
//     console.error("Error fetching product list:", error);
//     return { data: [] };
//   }
// };

const fetchProductList = async () => {
  //productController와 통신으로 productData 가져오기
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
