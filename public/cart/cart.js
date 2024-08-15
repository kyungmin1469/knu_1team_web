// 장바구니 데이터와 제품 정보를 가져오는 함수
const fetchCartItems = () => {
  const cartData = localStorage.getItem("cart");
  return cartData ? JSON.parse(cartData) : { items: [], totalprice: 0 };
};

// localStorage에 장바구니 데이터를 저장하는 함수
const saveCartItems = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// 특정 제품 정보 가져오기
const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`/api/product/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch product by id error:", error);
    return null; // Return null in case of an error
  }
};

// 장바구니 페이지를 렌더링하는 함수
const renderCart = async () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItemsContainer.innerHTML = ""; // 기존 내용 지우기

  const cart = fetchCartItems();
  const cartItems = cart.items;

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = "<p>장바구니가 비어있습니다.</p>";
    cartTotal.textContent = "총 금액: 0원";
    return;
  }

  let totalPrice = 0;

  for (const item of cartItems) {
    const product = await fetchProductById(item.productId);

    if (!product) {
      console.error(`Product with id ${item.productId} not found.`);
      continue; //제품이 없으면 나가기
    }

    const cartItemElement = document.createElement("li");

    const productTitle = document.createElement("h2");
    productTitle.textContent = product.title;
    productTitle.style.cursor = "pointer";
    productTitle.addEventListener("click", () => {
      window.location.href = `/product/${product._id}`;
    });
    cartItemElement.appendChild(productTitle);

    const productImage = document.createElement("img");
    productImage.src = product.imgUrl;
    productImage.alt = product.title;
    cartItemElement.appendChild(productImage);

    const productPrice = document.createElement("p");
    productPrice.textContent = `가격: ${product.price}원`;
    cartItemElement.appendChild(productPrice);

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = 1;
    quantityInput.value = item.quantity;
    quantityInput.id = `quantity-${product._id}`;
    quantityInput.max = product.stock;
    quantityInput.addEventListener("change", async () => {
      const newQuantity = parseInt(quantityInput.value, 10);
      if (newQuantity > product.stock) {
        alert("재고 수량을 초과할 수 없습니다.");
        quantityInput.value = product.stock; // 최대 재고 수량으로 설정
        return;
      }
      await updateQuantity(product._id, newQuantity);
      renderCart();
    });
    cartItemElement.appendChild(quantityInput);

    const removeButton = document.createElement("button");
    removeButton.textContent = "삭제";
    removeButton.addEventListener("click", async () => {
      await removeFromCart(product._id);
      renderCart();
    });
    cartItemElement.appendChild(removeButton);

    cartItemsContainer.appendChild(cartItemElement);

    totalPrice += product.price * item.quantity;
  }

  cartTotal.textContent = `총 금액: ${totalPrice}원`;
};

// 상품 수량 업데이트
const updateQuantity = async (productId, newQuantity) => {
  let cart = fetchCartItems();
  const cartItem = cart.items.find((item) => item.productId === productId);

  if (cartItem) {
    const product = await fetchProductById(productId);
    if (!product) {
      alert("제품 정보를 가져오는 데 실패했습니다.");
      return;
    }
    if (newQuantity > product.stock) {
      alert("재고 수량을 초과할 수 없습니다.");
      newQuantity = product.stock; // 최대 재고 수량으로 설정
    }
    cartItem.quantity = newQuantity;
    saveCartItems(cart);
    renderCart();
  }
};

// 장바구니에서 상품 제거
const removeFromCart = async (productId) => {
  let cart = fetchCartItems();
  cart.items = cart.items.filter((item) => item.productId !== productId);
  saveCartItems(cart);
  renderCart();
};

// 장바구니에 제품 추가
const addToCart = async (productId, quantity = 1) => {
  let cart = fetchCartItems();
  const product = await fetchProductById(productId);

  if (!product) {
    alert("제품 정보를 가져오는 데 실패했습니다.");
    return;
  }

  if (quantity > product.stock) {
    alert("재고 수량을 초과할 수 없습니다.");
    return;
  }

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
    if (existingItem.quantity > product.stock) {
      alert("재고 수량을 초과할 수 없습니다.");
      existingItem.quantity = product.stock;
    }
  } else {
    cart.items.push({ productId, quantity });
  }

  saveCartItems(cart);
  alert("장바구니에 제품이 추가되었습니다.");
  renderCart();
};

// 결제 처리
const checkout = async () => {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    alert("결제가 완료되었습니다.");
    localStorage.removeItem("cart"); // 결제 후 장바구니 비우기
    renderCart(); // 장바구니 뷰 새로고침
  } catch (error) {
    console.error("Checkout error:", error);
  }
};

// 페이지 로드 시 장바구니를 렌더링
document.addEventListener("DOMContentLoaded", renderCart);

// 추가 기능 관리 함수
const modifyCartItem = (productId, action, quantity = 1) => {
  switch (action) {
    case "add":
      addToCart(productId, quantity);
      break;
    case "remove":
      removeFromCart(productId);
      break;
    case "update":
      updateQuantity(productId, quantity);
      break;
    default:
      console.error("Invalid action:", action);
  }
};
// 제품 상세 페이지에서 장바구니에 추가
window.addToCart = addToCart;
