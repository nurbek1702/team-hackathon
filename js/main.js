const API = "http://localhost:3002/phones";
let inpName = document.querySelector("#inpName");
let inpMemory = document.querySelector("#inpMemory");
let inpImage = document.querySelector("#inpImage");
let inpPrice = document.querySelector("#inpPrice");
let btnAdd = document.querySelector("#btnAdd");
let btnOpenForm = document.querySelector("#flush-collapseOne");
let sectionProducts = document.querySelector("#sectionProducts");
let currentPage = 1;
let countPage = 1;
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");
let inpSearch = document.querySelector("#inpSearch");
let searchValue = "";
//Переменная для детального обзора
let detailsContainer = document.querySelector(".details");
btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpMemory.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }
  let newProduct = {
    productName: inpName.value,
    productMemory: inpMemory.value,
    productImage: inpImage.value,
    productPrice: inpPrice.value,
  };
  createProducts(newProduct);
  readProducts();
});

//! ================CREATE====================
function createProducts(product) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(product),
  });
  inpName.value = "";
  inpMemory.value = "";
  inpImage.value = "";
  inpPrice.value = "";
  btnOpenForm.classList.toggle("show");
}
//! =====================READ=======================
async function readProducts() {
  const response = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=4`
  );
  const data = await response.json();
  sectionProducts.innerHTML = "";
  data.forEach((item) => {
    sectionProducts.innerHTML += `
    <div class="card m-4 cardProduct" style="width: 14rem">
      <img
        id="${item.id}"
        src="${item.productImage}"
        alt=""
        class="card-img-top detailsCard"
        style="height: 280px"
      />
      <div class="card-body">
        <h5 class="card-title">${item.productName}</h5>
        <p class="card-text">${item.productMemory}</p>
        <span class="card-text">${item.productPrice}</span>
        <div>
        <button class="btn btn-outline-danger btnBuy" id="${item.id}">Buy</button>
        <button class="detailsCard btn btn-outline-warning">Details</button>
        <button class="btn btn-outline-danger btnDelete" id="${item.id}">Delete</button>
        <button class="btn btn-outline-warning rgb(181, 182, 241)" id="${item.id}" 
data-bs-toggle="modal" 
data-bs-target="#exampleModal">Edit</button>
        </div>
      </div>
    </div>
    `;
  });
  updateCart();
  pageFunc();
}

readProducts();
//!=========== delete ==========
document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readProducts());
  }
});

//!================Edit/ Save===============
let editInpName = document.querySelector("#editInpName");
let editInpMemory = document.querySelector("#editInpMemory");
let editInpImage = document.querySelector("#editInpImage");
let editInpPrice = document.querySelector("#editInpPrice");
let editBtnSave = document.querySelector("#editBtnSave");

document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        editInpName.value = data.productName;
        editInpMemory.value = data.productMemory;
        editInpImage.value = data.productImage;
        editInpPrice.value = data.productPrice;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});
editBtnSave.addEventListener("click", () => {
  let editedProduct = {
    productName: editInpName.value,
    productMemory: editInpMemory.value,
    productImage: editInpImage.value,
    productPrice: editInpPrice.value,
  };
  editProduct(editedProduct, editBtnSave.id);
});
function editProduct(editProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editProduct),
  }).then(() => readProducts());
}
//!================ Pagination ==================
function pageFunc() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      countPage = Math.ceil(data.length / 4);
    });
}
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readProducts();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readProducts();
});
//!=============SEARCH==================
inpSearch.addEventListener("input", (e) => {
  currentPage = 1;
  searchValue = e.target.value.trim();
  readProducts();
});
//!============= Categories ===========
let access = document.querySelector(".dropdown-item2");
access.addEventListener("click", (e) => {});
//!------------- Корзина -------------

document.addEventListener("click", (e) => {
  let buyClass = [...e.target.classList];
  if (buyClass.includes("btnBuy")) {
    let productId = e.target.getAttribute("data-id");
    let selectedProduct = data.find((item) => item.id === productId);
    if (selectedProduct) {
      addToCart(selectedProduct);
    }
  }
});
function addToCart(product) {
  let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  storedCart.push(product);
  localStorage.setItem("cart", JSON.stringify(storedCart));

  updateCart();
}
function updateCart() {
  let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItems = document.querySelector("#cart-items");
  cartItems.innerHTML = "";
  storedCart.forEach((item) => {
    cartItems.innerHTML += `<li>${item.productName} - ${item.productPrice}</li>`;
  });
}
let checkoutBtn = document.querySelector("#btnCheckout");
checkoutBtn.addEventListener("click", checkout);
function checkout() {
  let storedCart = JSON.parse(localStorage.getItem("cart")) || [];

  alert("Your order has been placed!");
  storedCart = [];
  localStorage.setItem("cart", JSON.stringify(storedCart));
  updateCart();
}

// !======================ДЕТАЛЬНЫЙ ОБЗОР======================
document.addEventListener("click", (event) => {
  let classList = [...event.target.classList];

  const productId = event.target
    .closest(".cardProduct")
    ?.querySelector("img")?.id;
  if (productId) {
    details(productId);
  }
});

async function details(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    const data = await res.json();

    if (!res.ok) {
      console.log(`HTTP Error! Status ${res.status}`);
    } else {
      displayDetails(data);
    }
  } catch (error) {
    console.error(error);
  }
}

function displayDetails(data) {
  // Отобразим детальную информацию внутри элемента .details
  detailsContainer.innerHTML = `
    <img src="${data.productImage}" alt="">
    <h2>${data.productName}</h2>
    <span>${data.productMemory}</span>
    <p>${data.productPrice}</p>
    <button class="btn btn-outline-warning btnCloseDetails">Close Details</button>
  `;

  // Покажем секцию с деталями и скроем секцию с книгами
  detailsContainer.style.display = "block";
  sectionProducts.style.display = "none";

  // Изменение в этой части
  let btnCloseDetails = detailsContainer.querySelector(".btnCloseDetails");
  btnCloseDetails.addEventListener("click", closeDetails);
}

function closeDetails() {
  // Скроем секцию с деталями и покажем секцию с книгами
  detailsContainer.style.display = "none";
  sectionProducts.style.display = "block";
}
