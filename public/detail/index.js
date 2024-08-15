const queryParams = new URLSearchParams(window.location.search);
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
