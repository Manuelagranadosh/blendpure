
const PRODUCT = {
  name: "BlendPure — Estación inteligente",
  price: 349900
};

let quantity = 0;

const $ = (selector) => document.querySelector(selector);

const cartOverlay = $("#cartOverlay");
const checkoutModal = $("#checkoutModal");
const cartItems = $("#cartItems");
const cartCount = $("#cartCount");
const cartTotal = $("#cartTotal");

const formatCOP = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(amount);

// Menú para dispositivos móviles
$("#menuToggle").addEventListener("click", () => {
  $("#mainNav").classList.toggle("open");
});

$("#mainNav").querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    $("#mainNav").classList.remove("open");
  });
});

// Agregar producto a la bolsa
$("#addProduct").addEventListener("click", () => {
  quantity += 1;
  renderCart();
  cartOverlay.classList.add("open");
});

$("#openCart").addEventListener("click", () => {
  renderCart();
  cartOverlay.classList.add("open");
});

$("#closeCart").addEventListener("click", () => {
  cartOverlay.classList.remove("open");
});

// Cerrar al pulsar el fondo de la bolsa
cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) {
    cartOverlay.classList.remove("open");
  }
});

// Dibujar el contenido de la bolsa
function renderCart() {
  cartCount.textContent = quantity;
  cartTotal.textContent = formatCOP(quantity * PRODUCT.price);

  if (quantity === 0) {
    cartItems.innerHTML = "<p>Tu bolsa está vacía.</p>";
    $("#checkout").disabled = true;
    $("#checkout").style.opacity = ".5";
    return;
  }

  $("#checkout").disabled = false;
  $("#checkout").style.opacity = "1";

  cartItems.innerHTML = `
    <div class="cart-line">
      <div>
        <strong>${PRODUCT.name}</strong>
        <p>${formatCOP(PRODUCT.price)} por unidad</p>
        <button type="button" id="removeOne">−</button>
        <span style="padding:0 10px">${quantity}</span>
        <button type="button" id="addOne">+</button>
      </div>
      <strong>${formatCOP(quantity * PRODUCT.price)}</strong>
    </div>
  `;

  $("#removeOne").addEventListener("click", () => {
    quantity = Math.max(0, quantity - 1);
    renderCart();
  });

  $("#addOne").addEventListener("click", () => {
    quantity += 1;
    renderCart();
  });
}

// Abrir checkout de demostración
$("#checkout").addEventListener("click", () => {
  if (quantity < 1) return;

  $("#checkoutSummary").textContent =
    `${quantity} unidad(es) de ${PRODUCT.name}. Total: ` +
    formatCOP(quantity * PRODUCT.price) +
    ". Esta es una demostración académica, sin cobro real.";

  $("#checkoutMessage").textContent = "";
  $("#checkoutForm").reset();

  cartOverlay.classList.remove("open");
  checkoutModal.classList.add("open");
});

// Cerrar checkout
$("#closeCheckout").addEventListener("click", () => {
  checkoutModal.classList.remove("open");
});

checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) {
    checkoutModal.classList.remove("open");
  }
});

// Confirmar únicamente la demostración
$("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  $("#checkoutMessage").textContent =
    "Demostración completada. No se realizó ningún cobro ni se envió un pedido real.";

  quantity = 0;
  renderCart();
});

// Cerrar ventanas con Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cartOverlay.classList.remove("open");
    checkoutModal.classList.remove("open");
    $("#mainNav").classList.remove("open");
  }
});

// Inicializar el estado de la bolsa
renderCart();

