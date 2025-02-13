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

// localStorage.clear();

// Function to calculate total
function updateTotal() {
  if (price.value == "" || taxes.value == "" || discount.value == "") {
    total.value = "";
    total.style.background = "rgba(204, 0, 0, 0.35)";
    return;
  }
  let priceValue = parseFloat(price.value) || 0;
  let taxesValue = parseFloat(taxes.value) || 0;
  let discountValue = parseFloat(discount.value) || 0;
  let totalValue = priceValue + taxesValue - discountValue;
  total.value = totalValue >= 0 ? totalValue : 0;
  total.style.background = "#EEEFF2";
}

// Event listeners to update total dinamically
price.addEventListener("input", updateTotal);
taxes.addEventListener("input", updateTotal);
discount.addEventListener("input", updateTotal);

// Init product array from local storage
let products = JSON.parse(localStorage.getItem("product")) || [];

// Function to add products
btnAdd.onclick = () => {
  if (parseInt(count.value) <= 0) {
    alert("You're trying to add 0 elements");
    return;
  }
  const itemCount = parseInt(count.value) || 1;

  for (let i = 0; i < itemCount; i++) {
    let item = {
      title: title.value.trim(),
      price: price.value.trim(),
      taxes: taxes.value.trim(),
      discount: discount.value.trim(),
      total: total.value.trim(),
      category: category.value.trim(),
    };

    if (
      item.title === "" ||
      item.price === "" ||
      item.taxes === "" ||
      item.discount === "" ||
      item.category === ""
    ) {
      alert("All fields must be filled.");
      return;
    }
    products.push(item);
    localStorage.setItem("product", JSON.stringify(products));
  }

  [title, price, taxes, discount, count, category].forEach(
    (input) => (input.value = "")
  );
  updateTotal();
  showProduct();
};

// function that diisplays the delete button
function showDeleteButton() {
  btnDelete.style.display = "block";
  btnDelete.innerHTML = `delete all (${products.length})`;
}

// Function that shows the products in the table
function showProduct() {
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
			<td><button class="btn-secondary btn-update" onclick="updateOneProduct(${i})">update</button></td>
			<td><button class="btn-secondary btn-delete" onclick="deleteOneProduct(${i})">delete</button></td>
		</tr>
	`;
  }
  table.innerHTML = rows;
  if (products.length > 0) {
    showDeleteButton();
  }
}

// SHow data from local storage
showProduct();

// Function to delete all data from table
btnDelete.addEventListener("click", () => {
  table.innerHTML = "";
  localStorage.clear();
  products = [];
  btnDelete.style.display = "none";
});

// function to delete one product from table
function deleteOneProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("product", JSON.stringify(products));
  showProduct();
}

// function to update one product
function updateOneProduct(index) {
  title.value = products[index].title;
  price.value = products[index].price;
  taxes.value = products[index].taxes;
  discount.value = products[index].discount;
  total.value = products[index].total;
  category.value = products[index].category;

  count.setAttribute("readonly", null);
  btnAdd.textContent = "update product";
  btnAdd.onclick = () => {
    saveUpdatedProduct(index);
  };
}

// function to save the updates for product
function saveUpdatedProduct(index) {
  if (
    title.value == "" ||
    price.value == "" ||
    taxes.value == "" ||
    discount.value == "" ||
    category.value == ""
  ) {
    alert("Enter some values");
    return;
  }
  products[index] = {
    title: title.value.trim(),
    price: price.value.trim(),
    taxes: taxes.value.trim(),
    discount: discount.value.trim(),
    total: total.value.trim(),
    category: category.value.trim(),
  };

  localStorage.setItem("product", JSON.stringify(products));

  btnAdd.textContent = "add product";
  [title, price, taxes, discount, total, category].forEach(
    (input) => (input.value = "")
  );
  showProduct();
  count.removeAttribute("readonly");
}

// Function that filters table
function filterTableBy(index) {
  let filter = search.value.trim().toLowerCase();
  let rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let cell = rows[i].getElementsByTagName("td")[index];
    if (cell) {
      let text = cell.textContent.trim().toLowerCase();
      rows[i].style.display = text.includes(filter) ? "" : "none";
    }
  }
}

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

window.onscroll = () => {
  if (window.scrollY >= 1000) {
    scroll.style.display = "block";
  } else {
    scroll.style.display = "none";
  }
};

scroll.onclick = () => {
  window.scrollTo(0, 0);
};
