const fetchBannerImages = async () => {
  try {
    const response = await fetch("/api/banners"); // 배너 이미지를 가져오는 API 호출
    if (response.ok) {
      const data = await response.json();
      return data.data; // 배너 리스트 반환
    } else {
      console.error("배너 이미지를 가져오는 데 실패했습니다.");
      return [];
    }
  } catch (error) {
    console.error("에러 발생:", error);
    return [];
  }
};

const fetchProductList = async () => {
  try {
    const response = await fetch("/api/products"); // 상품 정보를 가져오는 API 호출
    if (response.ok) {
      const data = await response.json();
      return data.data; // 상품 리스트 반환
    } else {
      console.error("상품 정보를 가져오는 데 실패했습니다.");
      return [];
    }
  } catch (error) {
    console.error("에러 발생:", error);
    return [];
  }
};

const renderBanner = async () => {
  const bannerImages = await fetchBannerImages(); // 배너 이미지 가져오기
  const banner = document.getElementById("banner");

  if (bannerImages.length === 0) {
    banner.innerHTML = "<p>배너가 없습니다.</p>";
    return;
  }

  bannerImages.forEach((bannerData, index) => {
    const img = document.createElement("img");
    img.src = bannerData.imgUrl; // MongoDB에서 가져온 이미지 URL
    img.alt = bannerData.title; // 배너 제목
    img.style.left = `${index * 100}%`; // 슬라이드 위치 설정
    banner.appendChild(img);
  });
};

const renderProductGrid = async () => {
  const productList = await fetchProductList(); // 상품 리스트 가져오기
  const productGrid = document.getElementById("product_grid");

  if (productList.length === 0) {
    productGrid.innerHTML = "<p>상품이 없습니다.</p>";
    return;
  }

  productList.forEach((product) => {
    const itemElem = document.createElement("div");
    itemElem.classList.add("product-item");
    itemElem.innerHTML = `
          <img src="${product.imgUrl}" alt="${product.title}" />
          <div>${product.title}</div>
          <div>가격: ${product.price}원</div>
          <div>[상세설명] ${product.description}</div>
          <div>재고수량: ${product.stock}개</div>
      `;
    productGrid.appendChild(itemElem);
  });
};

// 초기화 함수
const init = async () => {
  await renderBanner(); // 배너 렌더링
  await renderProductGrid(); // 상품 그리드 렌더링
};

init(); // 초기화 호출

// 로그인 버튼 클릭 이벤트 처리
document.getElementById("loginButton").addEventListener("click", () => {
  window.location.href = "/signin"; // 로그인 페이지로 리다이렉트
});
