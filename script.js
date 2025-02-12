let body = document.body;
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let btnAdd = document.getElementById("btn-add");
let table = document.getElementById("table");
let search = document.getElementById("search");
let btnSearchTitle = document.getElementById("btn-search-title");
let btnSearchCategory = document.getElementById("btn-search-category");
let btnDelete = document.getElementById("btn-delete");

localStorage.clear();

const saveToLocalStorage = () => {
  localStorage.setItem("title", title.value.trim());
  localStorage.setItem("price", price.value.trim());
  localStorage.setItem("taxes", taxes.value.trim());
  localStorage.setItem("discount", discount.value.trim());
  localStorage.setItem("count", count.value.trim());
  localStorage.setItem("category", category.value.trim());
  localStorage.setItem("total", total.value);
};

const updateTotal = () => {
  if (
    price.value.trim() === "" ||
    taxes.value.trim() === "" ||
    discount.value.trim() === ""
  ) {
    total.value = "";
    total.style.background = "rgba(204, 0, 0, 0.35)";
    localStorage.setItem("total", "");
    return;
  }
  let priceValue = parseFloat(price.value) || 0;
  let taxesValue = parseFloat(taxes.value) || 0;
  let discountValue = parseFloat(discount.value) || 0;

  let totalValue = priceValue + taxesValue - discountValue;
  total.value = totalValue >= 0 ? totalValue : 0;
  total.style.background = "#EEEFF2";
  localStorage.setItem("total", total.value);
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

function addItem(itemObj) {
  let row = document.createElement("tr");
  let itemValues = [
    itemObj.id,
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

let index = localStorage.getItem("index")
  ? parseInt(localStorage.getItem("index"))
  : 0;

btnAdd.onclick = () => {
  let itemCount = parseInt(count.value) || 1;
  for (let i = 0; i < itemCount; i++) {
    let item = {
      id: index,
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
    addItem(item);
    index++;
  }
  localStorage.setItem("index", index);
};

function filterTableBy(columnIndex) {
  let filter = search.value.trim().toLowerCase();
  let rows = table.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    let cell = rows[i].getElementsByTagName("td")[columnIndex];
    if (cell) {
      let text = cell.textContent.trim().toLowerCase();
      rows[i].style.display = text.includes(filter) ? "" : "none";
    }
  }
}

btnSearchTitle.addEventListener("focus", () => {
  filterTableBy(1);
});

btnSearchCategory.addEventListener("focus", () => {
  filterTableBy(6);
});
