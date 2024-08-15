document.addEventListener("DOMContentLoaded", () => {
  const cartListWrapper = document.getElementById("cart_list_wrapper");
  const totalPriceElement = document.getElementById("totalPrice");

  const renderCartList = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalPrice = 0;

    if (cart.length === 0) {
      cartListWrapper.innerHTML = "<p>장바구니가 비어 있습니다.</p>";
      totalPriceElement.textContent = "";
      return;
    }

    cart.forEach((product) => {
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
          <div>수량: ${product.quantity}개</div>
          <div>총 가격: ${itemTotalPrice}원</div>
          <div>[상세설명] ${product.description}</div>
        `;

      cartListWrapper.appendChild(productItem);
    });

    totalPriceElement.textContent = `총합: ${totalPrice}원`;
  };

  document
    .getElementById("orderForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

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

      //   try {
      //     const response = await fetch("/api/order", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(orderData),
      //     });

      //     if (response.ok) {
      alert("결제가 성공적으로 완료되었습니다.");
      localStorage.removeItem("cart"); // 장바구니 비우기
      window.location.href = "http://localhost:8000/main"; // 메인 화면으로 이동
      //     } else {
      //       // 오류 처리
      //       const errorText = await response.text();
      //       alert(`결제 처리 중 오류가 발생했습니다: ${errorText}`);
      //       console.error("Error:", errorText);
      //     }
      //   } catch (error) {
      //     // 네트워크 오류 처리
      //     alert("네트워크 오류가 발생했습니다. 결제를 다시 시도해 주세요.");
      //     console.error("Network Error:", error);
      //   }
    });

  renderCartList();
});
