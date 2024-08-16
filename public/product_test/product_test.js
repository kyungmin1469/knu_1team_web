document.addEventListener("DOMContentLoaded", () => {
  const cartListWrapper = document.getElementById("cart_list_wrapper"); //장바구니 항목 표시
  const totalPriceElement = document.getElementById("totalPrice"); //총합 표시

  // 로그인 여부 확인
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token"); // 로그인 시 저장한 토큰을 확인
    return token !== null; // 토큰이 존재하면 로그인 상태
  };

  //장바구니 업데이트
  const updateCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart)); //localStorage에서 장바구니 정보 가져옴
    renderCartList();
  };

  // 장바구니 렌더링
  const renderCartList = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || []; //localStorage에서 장바구니 정보 가져옴
    let totalPrice = 0; //총합 초기화

    cartListWrapper.innerHTML = ""; //장바구니 목록 초기화

    //장바구니 비어있는 경우
    if (cart.length === 0) {
      cartListWrapper.innerHTML = "<p>장바구니가 비어 있습니다.</p>";
      totalPriceElement.textContent = "";
      return;
    }

    //장바구니에 물건이 있는 경우
    cart.forEach((product, index) => {
      const productItem = document.createElement("div");
      productItem.classList.add("product-item");

      const itemTotalPrice = product.quantity * parseInt(product.price, 10);
      totalPrice += itemTotalPrice;

      productItem.innerHTML = `
          <div>
            <img src="${product.imgUrl}" alt="${product.title}" />
          </div>
          <div>${product.title}</div>
          <div>가격: ${product.price}원</div>
          <div>수량: 
            <input type="number" value="${product.quantity}" min="1" max="${product.stock}" id="quantity-${index}" />
          </div>
          <div>총 가격: ${itemTotalPrice}원</div>
          <div>[상세설명] ${product.description}</div>
          <button class="remove" data-index="${index}">삭제</button>
        `;

      cartListWrapper.appendChild(productItem); //장바구니 목록에 추가
    });

    totalPriceElement.textContent = `총합: ${totalPrice}원`;

    // 장바구니 삭제 버튼
    document.querySelectorAll(".remove").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index; //클릭된 버튼의 인덱스 가져옴
        cart.splice(index, 1); //해당 인덱스의 항목 삭제
        updateCart(cart);
      });
    });

    // 장바구니 수정 버튼
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("change", (event) => {
        const index = event.target.id.split("-")[1]; //클릭된 버튼의 인덱스 가져옴
        const newQuantity = parseInt(event.target.value, 10);
        const stock = parseInt(cart[index].stock, 10);

        if (newQuantity > stock) {
          alert(`구매할 수 있는 ${stock}개 가 초과되었습니다.`);
          event.target.value = stock;
          cart[index].quantity = stock;
        } else {
          cart[index].quantity = newQuantity; //해당 인덱스의 항목 업데이트
        }
        updateCart(cart);
      });
    });
  };

  //결제 클릭 시
  document
    .getElementById("orderForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault(); //페이지 리로드 방지

      //로그아웃 상태로 실행 시
      if (!isUserLoggedIn()) {
        alert("로그인이 필요합니다.");
        window.location.href = "/signin"; //로그인 페이지로 이동
        return;
      }

      //결제 정보 수집
      const orderData = {
        buyerName: document.getElementById("buyerName").value,
        buyerPhone: document.getElementById("buyerPhone").value,
        buyerEmail: document.getElementById("buyerEmail").value,
        recipientName: document.getElementById("recipientName").value,
        recipientAddress: document.getElementById("recipientAddress").value,
        recipientPhone: document.getElementById("recipientPhone").value,
        products: JSON.parse(localStorage.getItem("cart")),
        totalPrice: totalPriceElement.textContent
          .replace("총합: ", "")
          .replace("원", ""),
      };

      alert("결제가 성공적으로 완료되었습니다.");
      localStorage.removeItem("cart"); // 장바구니 비우기
      window.location.href = "/main"; // 메인 화면으로 이동
    });

  renderCartList();
});
