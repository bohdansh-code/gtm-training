// Ініціалізація dataLayer для GTM-тренувань
window.dataLayer = window.dataLayer || [];

const logEl = document.getElementById("log");

function logEvent(type, label, extra) {
  const row = document.createElement("div");
  row.className = "log-entry";
  const time = new Date().toLocaleTimeString();
  const ts = document.createElement("span");
  ts.className = "log-timestamp";
  ts.textContent = "[" + time + "]";
  row.appendChild(ts);

  const mainText = document.createElement("span");
  mainText.textContent = " event: " + type;
  if (label) mainText.textContent += " | label: " + label;
  if (extra) mainText.textContent += " | " + extra;
  row.appendChild(mainText);

  logEl.appendChild(row);
  logEl.scrollTop = logEl.scrollHeight;
}

function pushToDataLayer(eventName, payload = {}) {
  const data = Object.assign({ event: eventName }, payload);
  window.dataLayer.push(data);
  logEvent(eventName, payload.event_label || "", JSON.stringify(payload));
}

// Перелік товарів
const products = [
  {
    id: "tshirt_white",
    name: "Біла футболка",
    description: "Organic cotton, unisex",
    price: 29,
  },
  {
    id: "hoodie_navy",
    name: "Синя худі",
    description: "Soft fleece, oversize fit",
    price: 59,
  },
  {
    id: "jeans_slim",
    name: "Джинси slim fit",
    description: "Mid waist, blue",
    price: 79,
  },
  {
    id: "jacket_bomber",
    name: "Бомбер чорний",
    description: "Lightweight, everyday",
    price: 99,
  },
  {
    id: "sneakers_white",
    name: "Кросівки білі",
    description: "Leather, everyday",
    price: 89,
  },
];

let cart = [];
let currentStep = "start";

const purchaseStartStep = document.getElementById("purchase-start-step");
const paymentStep = document.getElementById("payment-step");
const productsStep = document.getElementById("products-step");
const checkoutStep = document.getElementById("checkout-step");
const successStep = document.getElementById("success-step");

const stepPills = {
  start: document.getElementById("step-pill-start"),
  payment: document.getElementById("step-pill-payment"),
  products: document.getElementById("step-pill-products"),
  checkout: document.getElementById("step-pill-checkout"),
  success: document.getElementById("step-pill-success"),
};

function setStep(step) {
  currentStep = step;
  purchaseStartStep.classList.add("hidden");
  paymentStep.classList.add("hidden");
  productsStep.classList.add("hidden");
  checkoutStep.classList.add("hidden");
  successStep.classList.add("hidden");

  Object.values(stepPills).forEach((pill) => pill.classList.remove("active"));

  if (step === "start") {
    purchaseStartStep.classList.remove("hidden");
    stepPills.start.classList.add("active");
  } else if (step === "payment") {
    paymentStep.classList.remove("hidden");
    stepPills.payment.classList.add("active");
  } else if (step === "products") {
    productsStep.classList.remove("hidden");
    stepPills.products.classList.add("active");
  } else if (step === "checkout") {
    checkoutStep.classList.remove("hidden");
    stepPills.checkout.classList.add("active");
  } else if (step === "success") {
    successStep.classList.remove("hidden");
    stepPills.success.classList.add("active");
  }
}

// Рендер товарів і кошика
const productsGrid = document.getElementById("products-grid");
const cartSummary = document.getElementById("cart-summary");
const checkoutCartView = document.getElementById("checkout-cart-view");

function renderProducts() {
  productsGrid.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div>
        <div class="product-name">${p.name}</div>
        <div class="product-meta">${p.description}</div>
        <div class="product-price">$${p.price.toFixed(2)}</div>
      </div>
      <button
        class="btn small"
        data-product-id="${p.id}"
        data-product-name="${p.name}"
        data-product-price="${p.price}"
        data-gtm-event="add_to_cart"
        data-gtm-label="${p.name}"
      >
        Додати в кошик
      </button>
    `;
    productsGrid.appendChild(card);
  });
}

function renderCartSummary() {
  if (!cart.length) {
    cartSummary.innerHTML =
      '<div class="cart-empty">Кошик порожній. Додайте щось, щоб продовжити.</div>';
    return;
  }
  let html = "";
  let total = 0;
  cart.forEach((item) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    html += `
      <div class="cart-line">
        <span>${item.name} × ${item.qty}</span>
        <span>$${lineTotal.toFixed(2)}</span>
      </div>
    `;
  });
  html += `
    <div class="cart-total">
      <span>Всього</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;
  cartSummary.innerHTML = html;
}

function renderCheckoutCart() {
  if (!cart.length) {
    checkoutCartView.innerHTML =
      '<div class="cart-empty">Кошик порожній. Поверніться до товарів.</div>';
    return;
  }
  let html = "<strong>Ваше замовлення:</strong>";
  let total = 0;
  html += '<div class="cart-summary-inner">';
  cart.forEach((item) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    html += `
      <div class="cart-line">
        <span>${item.name} × ${item.qty}</span>
        <span>$${lineTotal.toFixed(2)}</span>
      </div>
    `;
  });
  html += `
    <div class="cart-total">
      <span>Разом до оплати</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;
  html += "</div>";
  checkoutCartView.innerHTML = html;
}

function resetCheckoutStatus() {
  const dot = document.getElementById("checkout-status-dot");
  const text = document.getElementById("checkout-status-text");
  dot.className = "status-dot";
  text.textContent = "Очікує дії користувача…";
}

// Обробка кнопок/форм
document
  .getElementById("btn-start-purchase")
  .addEventListener("click", function () {
    pushToDataLayer("start_purchase", {
      event_label: "Start Purchase Button",
    });
    setStep("payment");
  });

document
  .getElementById("btn-payment-back")
  .addEventListener("click", function () {
    setStep("start");
  });

document
  .getElementById("btn-payment-continue")
  .addEventListener("click", function () {
    const number = document.getElementById("card-number").value.trim();
    const expiry = document.getElementById("card-expiry").value.trim();
    const cvv = document.getElementById("card-cvv").value.trim();
    const name = document.getElementById("card-name").value.trim();

    if (!number || !expiry || !cvv || !name) {
      alert("Будь ласка, заповніть усі поля картки (це лише тренування).");
      return;
    }

    pushToDataLayer("payment_details_submitted", {
      event_label: "Payment Details Submitted",
    });

    setStep("products");
    renderProducts();
    renderCartSummary();

    pushToDataLayer("view_products", {
      event_label: "Products Step Viewed",
    });
  });

document
  .getElementById("btn-products-back")
  .addEventListener("click", function () {
    setStep("payment");
  });

productsGrid.addEventListener("click", function (e) {
  const btn = e.target.closest("button[data-product-id]");
  if (!btn) return;

  const id = btn.getAttribute("data-product-id");
  const name = btn.getAttribute("data-product-name");
  const price = parseFloat(btn.getAttribute("data-product-price"));

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  renderCartSummary();

  pushToDataLayer("add_to_cart", {
    event_label: name,
    item_id: id,
    item_name: name,
    price: price,
    currency: "USD",
  });
});

document
  .getElementById("btn-proceed-checkout")
  .addEventListener("click", function () {
    if (!cart.length) {
      alert("Кошик порожній. Додайте хоча б один товар.");
      return;
    }
    pushToDataLayer("begin_checkout", {
      event_label: "Begin Checkout Button",
      items_count: cart.length,
    });
    setStep("checkout");
    renderCheckoutCart();
    resetCheckoutStatus();
  });

document
  .getElementById("btn-checkout-back")
  .addEventListener("click", function () {
    setStep("products");
  });

document.getElementById("btn-pay").addEventListener("click", function () {
  if (!cart.length) {
    alert("Кошик порожній. Немає що оплачувати.");
    return;
  }
  const dot = document.getElementById("checkout-status-dot");
  const text = document.getElementById("checkout-status-text");
  dot.className = "status-dot processing";
  text.textContent = "Платіж обробляється…";

  let total = 0;
  cart.forEach((item) => (total += item.price * item.qty));

  // Імітація затримки оплати
  setTimeout(() => {
    dot.className = "status-dot success";
    text.textContent = "Оплата пройшла успішно.";

    pushToDataLayer("purchase", {
      event_label: "Purchase Completed",
      value: total,
      currency: "USD",
      items: cart.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.qty,
      })),
    });

    setStep("success");
  }, 1500);
});

document
  .getElementById("btn-new-purchase")
  .addEventListener("click", function () {
    cart = [];
    document.getElementById("card-number").value = "";
    document.getElementById("card-expiry").value = "";
    document.getElementById("card-cvv").value = "";
    document.getElementById("card-name").value = "";
    setStep("start");
  });

// Реєстрація
const regForm = document.getElementById("registration-form");
const regMsg = document.getElementById("registration-message");
regForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("reg-email").value.trim();
  const pwd = document.getElementById("reg-password").value.trim();
  const terms = document.getElementById("reg-terms").checked;

  if (!email || !pwd || !terms) {
    regMsg.textContent =
      "Будь ласка, заповніть email, пароль та погодьтесь з умовами.";
    regMsg.style.color = "#ef4444";
    return;
  }

  pushToDataLayer("registration_submit", {
    event_label: "Registration Form Submitted",
    email_domain: email.split("@")[1] || "",
  });

  regMsg.textContent = "Дякуємо! Акаунт успішно створено (симуляція).";
  regMsg.style.color = "#16a34a";

  regForm.reset();
});

// Тріал
const trialForm = document.getElementById("trial-form");
const trialMsg = document.getElementById("trial-message");
trialForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("trial-email").value.trim();
  const plan = document.getElementById("trial-plan").value;

  if (!email || !plan) {
    trialMsg.textContent = "Будь ласка, вкажіть email і оберіть план.";
    trialMsg.style.color = "#ef4444";
    return;
  }

  pushToDataLayer("trial_start", {
    event_label: "Trial Form Submitted",
    trial_plan: plan,
  });

  trialMsg.textContent =
    "Тріал успішно активовано (демо). Перевіряйте events у GTM.";
  trialMsg.style.color = "#16a34a";

  trialForm.reset();
});

// Кнопка очистки лога
document.getElementById("btn-clear-log").addEventListener("click", function () {
  logEl.innerHTML = "";
});

// Стартовий стан
setStep("start");
