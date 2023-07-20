const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const taxesInput = document.getElementById("taxes");
const adsInput = document.getElementById("ads");
const discountInput = document.getElementById("discount");
const quantityInput = document.getElementById("quantity");
const categoryInput = document.getElementById("category");
const total = document.getElementById("total");
const createBtn = document.getElementById("create-product");
const priceContainer = document.querySelector(".price");
const tbody = document.getElementById("tbody");
const deleteAll = document.getElementById("delete-all");
const searchTitle = document.getElementById("search-title");
const searchCategory = document.getElementById("search-category");
const searchInput = document.getElementById("search");
const dayMoodToggler = document.getElementById("day-mood-toggler");
const lightMood = document.getElementById("light-mood");
const darkMood = document.getElementById("dark-mood");
const container = document.getElementById("container");

let mood = "create";
let temp;
let productsArray = JSON.parse(localStorage.getItem("products")) || [];

// Get Total price
function getTotalPrice() {
  if (priceInput.value !== "") {
    let totalPrice =
      +priceInput.value +
      +taxesInput.value +
      +adsInput.value -
      +discountInput.value;

    total.innerHTML = totalPrice;
    total.classList.add("success");
  } else {
    total.innerHTML = "";
    total.classList.remove("success");
  }
}

// Output the totalPrice on the screen
priceContainer.addEventListener("keyup", (e) => {
  if (
    e.target.id === "price" ||
    e.target.id === "taxes" ||
    e.target.id === "ads" ||
    e.target.id === "discount"
  ) {
    getTotalPrice();
  }
});

// Clear all inputs
function clearInputs() {
  titleInput.value = "";
  priceInput.value = "";
  taxesInput.value = "";
  adsInput.value = "";
  discountInput.value = "";
  quantityInput.value = "";
  categoryInput.value = "";
  total.innerHTML = "";
}

// Show data in the page
function showData() {
  tbody.innerHTML = "";

  let index = 0;

  for (let product of productsArray) {
    let productContent = ` 
    <tr>
    <td>${index + 1}</td>
    <td>${product.title}</td>
    <td class="price-title">${product.price}</td>
    <td class="taxes">${product.taxes}</td>
    <td class="ads">${product.ads}</td>
    <td class="discount">${product.discount}</td>
    <td class="quantity">${product.quantity}</td>
    <td class="total-ds">${product.total}</td>
    <td>${product.category}</td>
    <td><i class="icon-edit" id="update" onclick="updateProduct(${index})"></i></td>
    <td><i class="icon-trash" id="delete" onclick="deleteProduct(${index})"></i></td>
    </tr>
  `;

    tbody.innerHTML += productContent;
    index++;
  }

  if (productsArray.length > 0) {
    deleteAll.innerHTML = `
    <button onclick="deleteAllProducts()">Delete All (${index}) Products</button> 
    <button onclick="printPageArea()">Print All (${index}) Products</button>`;
  } else {
    deleteAll.innerHTML = "";
  }
}
showData();

// Create new product information
function createProduct() {
  let productObj = {
    title: titleInput.value,
    price: priceInput.value,
    taxes: taxesInput.value,
    ads: adsInput.value,
    discount: discountInput.value,
    quantity:
      quantityInput.value > 1
        ? (quantity = quantityInput.value)
        : (quantity = 1),
    category: categoryInput.value,
    total: total.innerHTML,
  };

  function updateProductMood() {
    productsArray[temp] = productObj;
    createBtn.innerText = "Create";
    mood = "create";
  }

  if (
    titleInput.value !== "" &&
    priceInput.value !== "" &&
    categoryInput.value !== "" &&
    productObj.quantity <= 100
  ) {
    if (mood === "create") {
      // if (productObj.quantity > 1) {
      //   for (let i = 0; i < productObj.quantity; i++) {
      //     productsArray.push(productObj);
      //   }
      // } else {
      // }
      productsArray.push(productObj);
    } else {
      updateProductMood();
    }

    // Update if pressed the enter key
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        if (mood === "update") {
          updateProductMood();
        }
      }
    });

    clearInputs();
  }
  showData();
  total.classList.remove("success");
  saveDateToLocalStorage("products", productsArray);
}

// Create the product whe hitting on create btn or enter key
createBtn.addEventListener("click", createProduct);
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    createProduct();
  }
});

// Update product
function updateProduct(index) {
  product = productsArray[index];
  titleInput.value = product.title;
  priceInput.value = product.price;
  taxesInput.value = product.taxes;
  adsInput.value = product.ads;
  discountInput.value = product.discount;
  quantityInput.value = product.quantity;
  categoryInput.value = product.category;

  createBtn.innerText = "Update";
  getTotalPrice();
  mood = "update";

  temp = index;

  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// Delete Product
function deleteProduct(index) {
  let product = productsArray[index];

  customModal(
    `Delete Product!`,
    `<p class="delete-message">
      Are you sure you want to delete 
      <span class="delete-message">"${product.title}"</span> 
      product it's going to be deleted Permanently!
    </p>`,
    "",
    `deleting-product-confirmation`,
    "delete-btn",
    `Delete Product`
  );

  let deletingProductConfirmation = document.getElementById(
    "deleting-product-confirmation"
  );

  deletingProductConfirmation.addEventListener("click", (e) => {
    productsArray.splice(index, 1);
    showData();
    closeModal();
  });

  saveDateToLocalStorage("products", productsArray);
}

// Delete all products
function deleteAllProducts() {
  customModal(
    `Delete All products!`,
    `<p class="delete-message">
      Are you sure you want to delete all of your 
      <span>"${productsArray.length}"</span> 
      Products it's going to be deleted Permanently!
    </p>`,
    "",
    `deleting-all-products-confirmation`,
    "delete-btn",
    `Delete All products`
  );

  let deletingAllProductsConfirmation = document.getElementById(
    "deleting-all-products-confirmation"
  );

  deletingAllProductsConfirmation.addEventListener("click", (e) => {
    productsArray = [];
    showData();
    saveDateToLocalStorage("products", productsArray);
    closeModal();
  });
}

// Search product
let searchMood = "title";
searchTitle.addEventListener("click", (e) => searchProduct(e.target.id));
searchCategory.addEventListener("click", (e) => searchProduct(e.target.id));

function searchProduct(id) {
  if (id === "search-title") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  searchInput.placeholder = `Search By ${searchMood}`;
  searchInput.focus();

  searchInput.value = "";
}

searchInput.addEventListener("keyup", (e) =>
  search(e.target.value.toLowerCase())
);

function search(value) {
  let product;
  let productContent = "";
  let index = 0;
  function searchLoop() {
    productContent += ` 
      <tr>
      <td>${index + 1}</td>
      <td>${product.title}</td>
      <td class="price-title">${product.price}</td>
      <td class="taxes">${product.taxes}</td>
      <td class="ads">${product.ads}</td>
      <td class="discount">${product.discount}</td>
      <td class="quantity">${product.quantity}</td>
      <td class="total-ds">${product.total}</td>
      <td>${product.category}</td>
      <td><i class="icon-edit" id="update" onclick="updateProduct(${index})"></i></td>
      <td><i class="icon-trash" id="delete" onclick="deleteProduct(${index})"></i></td>
      </tr>
    `;
    tbody.innerHTML = productContent;
    index++;
  }
  for (product of productsArray) {
    if (searchMood === "title") {
      if (product.title.toLowerCase().includes(value)) {
        searchLoop();
      }
    }
    if (searchMood === "category") {
      if (product.category.toLowerCase().includes(value)) {
        searchLoop();
      }
    }
  }
}

// Print product
function printPageArea() {
  let printContent = document.getElementById("table").innerHTML;
  let originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  document.body.innerHTML = originalContent;
  window.print();
}

// Save date to localStorage
function saveDateToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Dark & Light Theme
dayMoodToggler.addEventListener("click", (e) => {
  if (e.target.classList.contains("icon-sun-filled")) {
    lightTheme(e);
  } else {
    darkTheme(e);
  }
});

function lightTheme(e) {
  localStorage.setItem("theme", "light");
  document.body.classList.add("light-theme");
  lightMood.classList.add("active");
  darkMood.classList.remove("active");
  favicon.href = "favicons/light-favicon-icon.png";
}

function darkTheme(e) {
  localStorage.setItem("theme", null);
  document.body.classList.remove("light-theme");
  darkMood.classList.add("active");
  lightMood.classList.remove("active");
  favicon.href = "favicons/dark-favicon-icon.png";
}

if (localStorage.getItem("theme") === "light") {
  lightTheme();
} else {
  darkTheme();
}
