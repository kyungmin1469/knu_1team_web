document.addEventListener("DOMContentLoaded", async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const productId = queryParams.get("id");

  if (!productId) {
    alert("상품 ID가 없습니다.");
    return;
  }

  try {
    const response = await fetch(`/api/product/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const product = await response.json();
      document.getElementById("product-title").textContent = product.title;
      document.getElementById("product-image").src = product.imgUrl;
      document.getElementById(
        "product-price"
      ).textContent = `가격: ${product.price}원`;
      document.getElementById(
        "product-description"
      ).textContent = `상세설명: ${product.description}`;
      document.getElementById(
        "product-stock"
      ).textContent = `재고수량: ${product.stock}개`;
    } else {
      alert("상품 정보를 가져오는 데 실패했습니다.");
    }
  } catch (error) {
    console.error("서버 오류:", error);
    alert("상품 정보를 가져오는 도중 오류가 발생했습니다.");
  }
});
