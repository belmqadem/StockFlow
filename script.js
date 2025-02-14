// Select DOM elements
const title = document.getElementById("title");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const discount = document.getElementById("discount");
const total = document.getElementById("total");
const count = document.getElementById("count");
const category = document.getElementById("category");
const btnAdd = document.getElementById("btn-add");
const table = document.getElementById("product-table-body");
const search = document.getElementById("search");
const btnSearchTitle = document.getElementById("btn-search-title");
const btnSearchCategory = document.getElementById("btn-search-category");
const btnDelete = document.getElementById("delete");
const scroll = document.getElementById("scroll");
const output = document.querySelector(".stock-output");
const form = document.querySelector(".stock-input");

// Initialize product array from local storage
let products = JSON.parse(localStorage.getItem("products")) || [];

// Function to calculate total
function updateTotal() {
  if (price.value == "") {
    total.value = "";
    total.style.background = "var(--incorrect)";
    return;
  }
  let priceValue = parseFloat(price.value) || 0;
  let taxesValue = parseFloat(taxes.value) || 0;
  let discountValue = parseFloat(discount.value) || 0;
  let totalValue = priceValue + taxesValue - discountValue;
  total.value = totalValue >= 0 ? totalValue : 0;
  total.style.background = "#EEEFF2";
}

// Event listeners for dynamic total calcul
price.addEventListener("input", updateTotal);
taxes.addEventListener("input", updateTotal);
discount.addEventListener("input", updateTotal);

// Function to validate input fields dynamically
function validateInput(input, condition) {
  if (condition) {
    input.style.outline = "2px solid var(--incorrect)";
    input.dataset.invalid = "true";
  } else {
    input.style.outline = "none";
    input.dataset.invalid = "false";
  }
}

// Event listeners for real-time validation
title.addEventListener("input", () =>
  validateInput(title, title.value.trim() === "")
);
price.addEventListener("input", () => validateInput(price, price.value === ""));
category.addEventListener("input", () =>
  validateInput(category, category.value.trim() === "")
);

// Function to add a product
function addProduct() {
  let missingFields = [];

  if (title.value.trim() === "") {
    validateInput(title, true);
    missingFields.push("Title");
  }
  if (price.value === "" || parseFloat(price.value) <= 0) {
    validateInput(price, true);
    missingFields.push("Price");
  }
  if (category.value.trim() === "") {
    validateInput(category, true);
    missingFields.push("Category");
  }
  if (missingFields.length > 0) {
    document.querySelector("[data-invalid='true']").focus();
    return;
  }
  if (parseInt(count.value) <= 0) {
    count.style.outline = "2px solid var(--incorrect)";
    count.focus();
    return;
  } else {
    count.style.outline = "none";
  }

  const itemCount = parseInt(count.value) || 1;
  for (let i = 0; i < itemCount; i++) {
    products.push({
      title: title.value.trim(),
      price: price.value,
      taxes: taxes.value || 0,
      discount: discount.value || 0,
      total: total.value,
      category: category.value.trim(),
    });
  }

  localStorage.setItem("products", JSON.stringify(products));

  [title, price, taxes, discount, count, category, total].forEach((input) => {
    input.value = "";
    input.style.outline = "none";
    input.dataset.invalid = "false";
  });
  total.style.background = "var(--incorrect)";

  showProducts();
}

// Event listener for adding a product
btnAdd.onclick = addProduct;

// Function to display products in the table
function showProducts() {
  let rows = "";
  for (let i = 0; i < products.length; i++) {
    rows += `
      <tr>
        <td>${i}</td>
        <td>${products[i].title}</td>
        <td>${products[i].price}</td>
        <td>${products[i].taxes}</td>
        <td>${products[i].discount}</td>
        <td>${products[i].total}</td>
        <td>${products[i].category}</td>
        <td><button class="btn-secondary btn-update" onclick="updateOneProduct(${i})">Update</button></td>
        <td><button class="btn-secondary btn-delete" onclick="deleteOneProduct(${i})">Delete</button></td>
      </tr>
    `;
  }
  table.innerHTML = rows;
  btnDelete.innerHTML = `Delete All (${products.length})`;
  output.style.display = products.length > 0 ? "block" : "none";
}

// Function to delete all products
btnDelete.addEventListener("click", () => {
  table.innerHTML = "";
  localStorage.clear();
  products = [];
  output.style.display = "none";
});

// Function to delete one product
function deleteOneProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  showProducts();
}

// Function to update a product
function updateOneProduct(index) {
  title.value = products[index].title;
  price.value = products[index].price;
  taxes.value = products[index].taxes;
  discount.value = products[index].discount;
  total.value = products[index].total;
  category.value = products[index].category;
  count.setAttribute("readonly", "true");
  btnAdd.textContent = "Update Product";
  total.style.background = "var(--input-bg-color)";
  form.classList.add("update");

  form.scrollIntoView({ behavior: "smooth" });
  title.focus();

  btnAdd.onclick = function () {
    saveUpdatedProduct(index);
  };
}

// Function to save updated product
function saveUpdatedProduct(index) {
  let missingFields = [];
  if (title.value.trim() === "") {
    validateInput(title, true);
    missingFields.push("Title");
  }
  if (price.value === "" || parseFloat(price.value) <= 0) {
    validateInput(price, true);
    missingFields.push("Price");
  }
  if (category.value.trim() === "") {
    validateInput(category, true);
    missingFields.push("Category");
  }
  if (missingFields.length > 0) {
    document.querySelector("[data-invalid='true']").focus();
    return;
  }

  products[index] = {
    title: title.value.trim(),
    price: price.value,
    taxes: taxes.value || 0,
    discount: discount.value || 0,
    total: total.value,
    category: category.value.trim(),
  };

  localStorage.setItem("products", JSON.stringify(products));
  [title, price, taxes, discount, count, category, total].forEach((input) => {
    input.value = "";
    input.style.outline = "none";
    input.dataset.invalid = "false";
  });
  total.style.background = "var(--incorrect)";
  btnAdd.textContent = "Add Product";
  btnAdd.onclick = addProduct;
  count.removeAttribute("readonly");
  form.classList.remove("update");
  showProducts();
}

// Function to filter table results
function filterTableBy(index) {
  let filter = search.value.trim().toLowerCase();
  let rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let cell = rows[i].getElementsByTagName("td")[index];
    if (cell) {
      rows[i].style.display = cell.textContent
        .trim()
        .toLowerCase()
        .includes(filter)
        ? ""
        : "none";
    }
  }
}

// Event listeners for search functionality
btnSearchTitle.addEventListener("focus", () => {
  search.placeholder = "Search by Title...";
  search.dataset.searchIndex = "1";
  filterTableBy(1);
});

btnSearchCategory.addEventListener("focus", () => {
  search.placeholder = "Search by Category...";
  search.dataset.searchIndex = "6";
  filterTableBy(6);
});

search.addEventListener("input", () => {
  let index = search.dataset.searchIndex
    ? parseInt(search.dataset.searchIndex)
    : 1;
  filterTableBy(index);
});

// Scroll-to-top functionality
window.onscroll = () => {
  scroll.style.display = window.scrollY >= 1200 ? "block" : "none";
};

scroll.onclick = () => window.scrollTo(0, 0);

// // Load products on page load
window.onload = title.focus();
showProducts();
