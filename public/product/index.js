const test2 = document.getElementById("product_list_wrapper");

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
    itemElem.innerHTML = `
  <div>${v.title}</div>
  <div>가격: ${v.price}원}</div>
  <div>[상세설명] ${v.description}</div>
  <div>
    <img src="${v.imgUrl}" />
  </div>
  <div>재고수량: ${v.stock}</div>
  `;
    itemElem.addEventListener("click", () => {
      window.location.href = `/detail/?id=${v._id}`;
    });
    productListWrapper.append(itemElem);
  });
};

renderProductList();
