let body = document.body;
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let btnAdd = document.getElementById("btn-add");
let search = document.getElementById("search");
let btnSearchTitle = document.getElementById("btn-search-title");
let btnSearchCategory = document.getElementById("btn-search-category");
let btnDelete = document.getElementById("btn-delete");

const loadFromLocalStorage = () => {
  title.value = localStorage.title || "";
  price.value = localStorage.price || "";
  taxes.value = localStorage.taxes || "";
  discount.value = localStorage.discount || "";
  count.value = localStorage.count || "";
  category.value = localStorage.category || "";
  updateTotal();
};

const saveToLocalStorage = () => {
  localStorage.title = title.value.trim();
  localStorage.price = price.value.trim();
  localStorage.taxes = taxes.value.trim();
  localStorage.discount = discount.value.trim();
  localStorage.count = count.value.trim();
  localStorage.category = category.value.trim();
};

const updateTotal = () => {
  if (price.value === "" || taxes.value === "" || discount.value === "") {
    return;
  }
  let priceValue = parseFloat(price.value) || 0;
  let taxesValue = parseFloat(taxes.value) || 0;
  let discountValue = parseFloat(discount.value) || 0;
  let totalValue = priceValue + taxesValue - discountValue;
  total.value = totalValue >= 0 ? totalValue : 0;
  total.style.background = "#EEEFF2";
};

title.addEventListener("input", saveToLocalStorage);
price.addEventListener("input", () => {
  saveToLocalStorage();
  updateTotal();
});
taxes.addEventListener("input", () => {
  saveToLocalStorage();
  updateTotal();
});
discount.addEventListener("input", () => {
  saveToLocalStorage();
  updateTotal();
});
count.addEventListener("input", saveToLocalStorage);
category.addEventListener("input", saveToLocalStorage);

let table = document.getElementById("table");

function addItem(itemObj, index) {
  let row = document.createElement("tr");
  let itemValues = [
    index,
    itemObj.title,
    itemObj.price,
    itemObj.taxes,
    itemObj.discount,
    itemObj.total,
    itemObj.category,
  ];
  itemValues.forEach((value) => {
    let column = document.createElement("td");
    column.textContent = value;
    row.appendChild(column);
  });
  table.appendChild(row);

  let updateColumn = document.createElement("td");
  let updateBtn = document.createElement("button");
  updateBtn.textContent = "UPDATE";
  updateBtn.className = "btn-secondary";
  updateBtn.id = "btn-update";
  updateColumn.appendChild(updateBtn);
  row.appendChild(updateColumn);

  let deleteColumn = document.createElement("td");
  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "DELETE";
  deleteBtn.className = "btn-secondary";
  deleteBtn.id = "btn-delete-one";
  deleteColumn.appendChild(deleteBtn);
  row.appendChild(deleteColumn);

  table.appendChild(row);
}

btnAdd.onclick = () => {
  let item = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    discount: discount.value,
    total: total.value,
    category: category.value,
  };
  if (
    item.title === "" ||
    item.price === "" ||
    item.taxes === "" ||
    item.discount === "" ||
    item.category === ""
  ) {
    return;
  }
  let index = 1;
  addItem(item, index);
};
