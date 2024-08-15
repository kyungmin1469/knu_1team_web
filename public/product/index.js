const fetchProductList = async () => {
  //productController와 통신으로 productData 가져오기
  const fetchResult = fetch("api/product", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (fetchResult.ok) {
    const fetchData = await fetchResult.json();
    console.log(fetchData);
    return fetchData.data;
  } else {
    return null;
  }
};

const prod0uctListWrapper = document.getElementById("product_list_wrapper");
const renderProductList = async () => {
  // 상품 리스트는 Array나 null이 옴
  const productList = await fetchProductList();

  if (!productList || productList.length === 0) {
    console.log("Empty prod0uctList");
    return;
  }

  //productList가 존재하는 경우 .append
  //v가 body가 되는 느낌
  productList.forEach((v) => {
    //div 클래스 가져왔고
    const itemElem = document.createElement("div");
    itemElem.innerHTML = `
  <div>${v.title}</div>
  <div>가격: ${v.price}원}</div>
  <div>[상세설명] ${v.description}</div>
  <div>
    <img src = "${v.imgeUrl}" />
  </div>
  <div>재고수량: ${v.stock}</div>
  `;
    prod0uctListWrapper.append(itemElem);
  });
};

renderProductList();
