const tabla = document.getElementById("table");
const tablaBody = document.getElementById("tbody");
const cartLogo = document.querySelector(".cartLogo");
const cart = document.querySelector(".cart-items");
const total = document.querySelector(".total");
const productsContainer = document.querySelector(".cardsContainer");
const deleteCart = document.getElementById("resetCart");
const liItem = document.querySelectorAll("ul li");
let cartDom = [];
let totalPrice = [];
const stockCelulares = [
  { id: 7, brand: "iphone", ram: 8, color: "black", price: 3300, img: "iphone12.png" },
  { id: 1, brand: "samsung", ram: 8, color: "blue", price: 1200, img: "samsung.webp" },
  { id: 5, brand: "iphone", ram: 8, color: "blue", price: 1200, img: "iphone12.png" },
  { id: 4, brand: "samsung", ram: 16, color: "gray", price: 3600, img: "samsung.webp" },
  { id: 10, brand: "motorola", ram: 16, color: "green", price: 1800, img: "moto.png" },
  { id: 6, brand: "iphone", ram: 16, color: "green", price: 1600, img: "iphone12.png" },
  { id: 9, brand: "motorola", ram: 8, color: "blue", price: 1200, img: "moto.png" },
  { id: 2, brand: "samsung", ram: 16, color: "green", price: 2200, img: "samsung.webp" },
  { id: 8, brand: "iphone", ram: 16, color: "gray", price: 4700, img: "iphone12.png" },
  { id: 11, brand: "motorola", ram: 8, color: "black", price: 1400, img: "moto.png" },
  { id: 3, brand: "samsung", ram: 8, color: "black", price: 1200, img: "samsung.webp" },
  { id: 12, brand: "motorola", ram: 16, color: "gray", price: 3000, img: "moto.png" },
];
const iphoneProducts = stockCelulares.filter((element) => element.brand == "iphone");
const motorolaProducts = stockCelulares.filter((element) => element.brand == "motorola");
const samsungProducts = stockCelulares.filter((element) => element.brand == "samsung");

allEventListeners();
function allEventListeners() {
  productsContainer.addEventListener("click", addProduct);
  tablaBody.addEventListener("click", deletePhone);
  document.addEventListener("DOMContentLoaded", () => {
    cartDom = JSON.parse(localStorage.getItem("phones")) || [];
    totalPrice = JSON.parse(localStorage.getItem("totalPrice")) || [];
    cartToHTML();
    productsDom();
    document.getElementById("selection").addEventListener("change", sortBy);
  });
}
// gets the stockCelulares array and copy to the dom
function productsDom() {
  for (const cellphone of stockCelulares) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `    
      <div class="card_image"><img src="${cellphone.img}"></div>
      <div class="card_content">
        <h2 class="card_title">${cellphone.brand.toUpperCase()}</h2>
        <p class="ram">${cellphone.ram} Ram</p>
        <p class="color">Color <span>${cellphone.color}</span></p>
        <p class="price">$ <span class="dolar">${cellphone.price}</span></p>
       <button class="card_btn btn addToCart cursorPointer" data-id="${cellphone.id}">Add to the cart</button>
      </div>
    `;
    productsContainer.appendChild(card);
  }
}

// sort by price max or low
function sortBy() {
  let seleccion = $("#selection").val();
  if (seleccion == "high") {
    stockCelulares.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (seleccion == "cheap") {
    stockCelulares.sort(function (a, b) {
      return a.price - b.price;
    });
  }
  productsContainer.innerHTML = "";
  productsDom();
}

// // Paso 4- a limpio los productos previos
function clearHTMLCart() {
  $("#tbody").empty();
}

// Paso 6 reset cart
$("#resetCart").on("click", function () {
  cartDom = [];
  $(".total").html("Total ");
  cartToHTML();
});

// Delete phone cartDom
function deletePhone(e) {
  if (e.target.classList.contains("fa-trash")) {
    const phoneId = e.target.getAttribute("data-id");
    cartDom = cartDom.filter((phone) => phone.id !== phoneId);
    cartToHTML();
  }
}

// Paso 1 cuando hago click en comprar identifico el parent element osea donde está la info del producto
function addProduct(e) {
  e.preventDefault();
  if (e.target.classList.contains("addToCart")) {
    const selectedProduct = e.target.parentElement;
    readSelectedProduct(selectedProduct);
  }
}

// Paso 2 creo un objeto con la info del producto donde hice click
function readSelectedProduct(product) {
  const productInfo = {
    brand: product.querySelector("h2").textContent,
    ram: product.querySelector(".ram").textContent,
    color: product.querySelector("span").textContent,
    price: product.querySelector(".price span").textContent,
    id: product.querySelector("button").getAttribute("data-id"),
    cantidad: 1,
  };

  // Paso 7 revisa si un elemento ya existe en el carrito
  const existe = cartDom.some((product) => product.id === productInfo.id);
  if (existe) {
    const products = cartDom.map((phone) => {
      if (phone.id === productInfo.id) {
        phone.cantidad++;
        const phonePrice = parseFloat(phone.price);
        const productInfoPrice = parseFloat(productInfo.price);
        const phonePriceSum = phonePrice + productInfoPrice;
        phone.price = phonePriceSum;
        return phone;
      } else {
        return phone;
      }
    });
    cartDom = [...products];
  } else {
    cartDom = [...cartDom, productInfo];
  }

  // Paso 3 carga el producto clickeado al carrito
  cartToHTML();
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Phone added to the cart",
    showConfirmButton: false,
    timer: 1800,
  });
}

// Paso 4
function cartToHTML() {
  // a) limpiar el carrito (tablaBody) previo y copiamos el nuevo
  clearHTMLCart();

  // b) agregamos el nuevo producto al cartDom
  for (const producto of cartDom) {
    const fila = document.createElement("tr");
    fila.classList.add("row");
    fila.innerHTML = `
     <td> ${producto.brand.toUpperCase()}</td>
     <td> ${producto.color.toUpperCase()}</td>
     <td> ${producto.ram}</td>
     <td> ${producto.price}</td>
     <td class="center"> ${producto.cantidad}</td>
     <td> <i class="fas fa-trash" data-id="${producto.id}"></i></td>`;
    tablaBody.appendChild(fila);
  }

  totalPrice = cartDom.reduce((total, item) => {
    pricePhone = parseFloat(item.price);
    return total + pricePhone;
  }, 0);

  total.innerHTML = `Total: $${totalPrice}`;
  toStorage();
}

// save to local storage
function toStorage() {
  localStorage.setItem("phones", JSON.stringify(cartDom));
  localStorage.setItem("total", JSON.stringify(totalPrice));
}

// cart desplegable menu
cartLogo.addEventListener("click", function () {
  cart.classList.toggle("show");
});

// cierro menu con click afuera
document.onclick = function (event) {
  const element = "addToCart";
  if (
    event.target.parentElement.parentElement.id != "tbody" &&
    event.target.parentElement.parentElement.classList != "row" &&
    event.target.parentElement != cartLogo &&
    event.target != cart &&
    event.target.parentElement.classList != "card_content"
  ) {
    cart.classList.remove("show");
  }
};

// Active and Filters Phones using forEach and For..of
liItem.forEach((li) => {
  li.onclick = function () {
    liItem.forEach((li) => {
      li.className = "";
    });
    li.className = "active";
    productsContainer.innerHTML = "";

    // Filter
    const value = li.textContent;
    if (value == "Iphone") {
      for (const cellphone of iphoneProducts) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `    
        <div class="card_image"><img src="${cellphone.img}"></div>
        <div class="card_content">
          <h2 class="card_title">${cellphone.brand.toUpperCase()}</h2>
          <p class="ram">${cellphone.ram} Ram</p>
          <p class="color">Color <span>${cellphone.color}</span></p>
          <p class="price">$ <span class="dolar">${cellphone.price}</span></p>
         <button class="card_btn btn addToCart cursorPointer" data-id="${cellphone.id}">Add to the cart</button>
        </div>
      `;
        productsContainer.appendChild(card);
      }
    } else if (value == "Samsung") {
      for (const cellphone of samsungProducts) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `    
          <div class="card_image"><img src="${cellphone.img}"></div>
          <div class="card_content">
            <h2 class="card_title">${cellphone.brand.toUpperCase()}</h2>
            <p class="ram">${cellphone.ram} Ram</p>
            <p class="color">Color <span>${cellphone.color}</span></p>
            <p class="price">$ <span class="dolar">${cellphone.price}</span></p>
           <button class="card_btn btn addToCart cursorPointer" data-id="${cellphone.id}">Add to the cart</button>
          </div>
        `;
        productsContainer.appendChild(card);
      }
    } else if (value == "Motorola") {
      for (const cellphone of motorolaProducts) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `    
        <div class="card_image"><img src="${cellphone.img}"></div>
        <div class="card_content">
          <h2 class="card_title">${cellphone.brand.toUpperCase()}</h2>
          <p class="ram">${cellphone.ram} Ram</p>
          <p class="color">Color <span>${cellphone.color}</span></p>
          <p class="price">$ <span class="dolar">${cellphone.price}</span></p>
         <button class="card_btn btn addToCart cursorPointer" data-id="${cellphone.id}">Add to the cart</button>
        </div>
      `;

        productsContainer.appendChild(card);
      }
    } else {
      productsDom();
    }
  };
});

// GETJSON
const URLJSON = "owners.json";
$(".owners").prepend('<button id="btnAjax">See Owner</button>');
$("#btnAjax").click(() => {
  $.getJSON(URLJSON, function (respuesta, estado) {
    if (estado == "success") {
      let allOwners = respuesta.owner;

      for (const owner of allOwners) {
        Swal.fire({
          position: "center",
          icon: "info",
          title: `${owner.name}` + " " + `${owner.lastName}` + " " + `${owner.phoneNumber}` + " call only on weekdays.",
          showConfirmButton: false,
          timer: 8000,
        });
      }
    }
  });
});
