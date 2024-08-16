const queryParams = new URLSearchParams(window.location.search);
const buynow_btn = document.getElementById("buy-now");

document.addEventListener("DOMContentLoaded", async () => {
  const url = window.location.href;
  const productId = url.toString().split("id=")[1];
  const title = queryParams.get("title");
  const imgUrl = queryParams.get("imgUrl");
  const price = queryParams.get("price");
  const description = queryParams.get("description");
  const stock = queryParams.get("stock");
  console.log(productId);
  if (!productId) {
    alert("상품 ID가 없습니다.");
    return;
  }

  try {
    console.log(productId);
    const response = await fetch(`/api/product/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const product = await response.json();
      const { title, description, imgUrl, stock, price } = product.data;
      console.log(product);
      document.getElementById("product-title").textContent = title;
      document.getElementById("product-image").src = imgUrl;
      document.getElementById("product-price").textContent = `가격: ${price}원`;
      document.getElementById(
        "product-description"
      ).textContent = `상세설명: ${description}`;
      document.getElementById(
        "product-stock"
      ).textContent = `재고수량: ${stock}개`;
    } else {
      alert("상품 정보를 가져오는 데 실패했습니다.");
    }
  } catch (error) {
    console.error("서버 오류:", error);
    alert("상품 정보를 가져오는 도중 오류가 발생했습니다.");
  }
});

// 장바구니 버튼 누른 경우 localStorage에 저장
document.getElementById("add-to-cart").addEventListener("click", () => {
  const title = document.getElementById("product-title").textContent;
  const imgUrl = document.getElementById("product-image").src;
  const price = document
    .getElementById("product-price")
    .textContent.replace("가격: ", "")
    .replace("원", "");
  const description = document
    .getElementById("product-description")
    .textContent.replace("상세설명: ", "");
  const stock = parseInt(
    document
      .getElementById("product-stock")
      .textContent.replace("재고수량: ", "")
      .replace("개", ""),
    10
  );

  // 현재 장바구니 리스트를 로컬 스토리지에서 가져오기
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 장바구니에서 같은 제목의 상품이 있는지 확인
  let existingProduct = cart.find((product) => product.title === title);

  const inputQuantity = document.getElementById("quantity");
  const quantityToAdd = parseInt(inputQuantity.value, 10) || 1;

  if (existingProduct) {
    // 이미 같은 제목의 상품이 있는 경우
    const newQuantity = (existingProduct.quantity || 1) + quantityToAdd;
    if (newQuantity > stock) {
      alert(`재고 수량이 부족합니다. 최대 ${stock}개까지 담을 수 있습니다.`);
    } else {
      existingProduct.quantity = newQuantity;
      alert(`${title}이(가) 장바구니에 추가되었습니다. (수량: ${newQuantity})`);
    }
  } else {
    // 새로운 상품 정보 객체 생성
    const product = {
      title,
      imgUrl,
      price,
      description,
      stock,
      quantity: quantityToAdd,
    };

    // 장바구니에 새로운 상품 추가
    cart.push(product);

    alert(`${title}이(가) 장바구니에 추가되었습니다. (수량: ${quantityToAdd})`); //장바구니 추가 시 알림창
  }

  // 업데이트된 장바구니 리스트를 로컬 스토리지에 저장
  localStorage.setItem("cart", JSON.stringify(cart));
});

buynow_btn.addEventListener("click", function () {
  window.location.href = "/product_test/";
});
