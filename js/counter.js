function toggleCartStatusAndPriceAndDelivery () {
 const cartWrapper = document.querySelector(".cart-wrapper");
 const cartEmptyBadge = document.querySelector("[data-cart-empty]");
 const orderForm = document.querySelector("#order-form");

  if (cartWrapper.children.length > 0) {
    cartEmptyBadge.classList.add("none");
    orderForm.classList.remove("none");
  } else {
    cartEmptyBadge.classList.remove("none");
    orderForm.classList.add("none");
  }

  let totalPrice = 0;
  const priceCorz = document.querySelector(".total-price");
  const cards = cartWrapper.querySelectorAll(".cart-item");
  cards.forEach(function (item) {
    const cardCounter = item.querySelector("[data-counter]");
    const cardPrice = item.querySelector(".price__currency");
    const currentSum = +cardCounter.innerText * parseInt(cardPrice.innerText);
    totalPrice = totalPrice + currentSum;
  })
  priceCorz.innerText =  totalPrice;

  const deliveryStatus = document.querySelector(".delivery-cost");
  if (totalPrice > 1000) {
    deliveryStatus.innerText = "бесплатно";
    deliveryStatus.classList.add("free");
  } else {
    deliveryStatus.innerText = "300 ₽";
    deliveryStatus.classList.remove("free");
  }
}


window.addEventListener("click", function (event) {

  // Проверяем явлеяется ли элемент покоторому был совершен клик кнопкой ПЛЮС
  if (event.target.dataset.action === "plus") {
    const counterWrapper = event.target.closest(".counter-wrapper");  // от этого элемента, покоторому произошел клик поднимаемся к родительскому блоку closest(".counter-wrapper")
    const counter = counterWrapper.querySelector("[data-counter]");
    ++counter.innerText;
  }

  // Проверяем явлеяется ли элемент покоторому был совершен клик кнопкой МИНУС
  if (event.target.dataset.action === "minus" ){
    const counterWrapper = event.target.closest(".counter-wrapper");
    const counter = counterWrapper.querySelector("[data-counter]");
    if (counter.innerText > 1) {
      --counter.innerText;
    } else if (event.target.closest(".cart-wrapper") && +counter.innerText === 1) {
      const cardInCardWrapper = event.target.closest(".cart-item");
      cardInCardWrapper.remove();
      toggleCartStatusAndPriceAndDelivery();
    }
  }

  if (event.target.hasAttribute("data-cart")) {  //проверяем есть ли у этого евента атрибут hasAttribute("data-cart"), если да,то это кнопка добавить в корзину
    const card = event.target.closest(".card");
    const productInfoCard = {
      id: card.dataset.id,
      imgSrc: card.querySelector(".product-img").getAttribute("src"),
      title: card.querySelector(".item-title").innerText,
      itemsInBox: card.querySelector(".text-muted").innerText,
      weight: card.querySelector(".price__weight").innerText,
      price: card.querySelector(".price__currency").innerText,
      counter: card.querySelector("[data-counter]").innerText,
    }
    const cartWrapper = document.querySelector(".cart-wrapper");
    const itemInCard = cartWrapper.querySelector(`[data-id="${productInfoCard.id}"]`);
    if (itemInCard) {
      let couterCart = itemInCard.querySelector("[data-counter]");
      couterCart.innerText = +productInfoCard.counter + +couterCart.innerText;
    } else {
      cartWrapper.insertAdjacentHTML("beforeend", `
      <div class="cart-item" data-id="${productInfoCard.id}">
        <div class="cart-item__top">
            <div class="cart-item__img">
                <img src="${productInfoCard.imgSrc}" alt="">
            </div>
            <div class="cart-item__desc">
                <div class="cart-item__title">${productInfoCard.title}</div>
                <div class="cart-item__weight">${productInfoCard.itemsInBox} / ${productInfoCard.weight}</div>

             <div class="cart-item__details">

               <div class="items items&#45;&#45;small counter-wrapper">
                  <div class="items__control" data-action="minus">-</div>
                  <div class="items__current" data-counter>${productInfoCard.counter}</div>
                  <div class="items__control" data-action="plus">+</div>
              </div>

                <div class="price">
                    <div class="price__currency">${productInfoCard.price}</div>
                </div>
            </div>
            </div>
        </div>
      </div>
    `)
    }
    const counterReset = card.querySelector("[data-counter]");
    counterReset.innerText = "1";

    toggleCartStatusAndPriceAndDelivery();
  }

  if (event.target.hasAttribute("data-action") && event.target.closest(".cart-wrapper")) {
    toggleCartStatusAndPriceAndDelivery();
  }

  if (event.target.dataset.action === "order") {
      event.preventDefault();
      const wrapperModal = document.querySelector(".modal-window");
      wrapperModal.classList.remove("none");

      const price = document.querySelector(".total-price");
      const telephone = document.querySelector(".form-control");

      const allCards = document.querySelectorAll(".cart-item__top");
      const modalWindowSubject = document.querySelector(".modal-window__subject");
      allCards.forEach(function (item) {
          const title = item.querySelector(".cart-item__title");
          const weight = item.querySelector(".cart-item__weight");
          const counter = item.querySelector(".items__current");
          modalWindowSubject.insertAdjacentHTML("beforeend", `
                <span class="modal-window__ingredients">
                    ${title.textContent} ${weight.textContent} наборов: ${counter.textContent}, 
                </span>
          `);
      });
      modalWindowSubject.insertAdjacentHTML("afterend", `
                <p>Цена: ${price.textContent}₽</p>
                <p>Ваш номер: ${telephone.value}</p>
          `);

      const modalCloseBtn = document.querySelector(".modal-window__submit-btn");
      modalCloseBtn.addEventListener("click", function (event) {
          document.querySelector(".modal-window__content").remove();
          wrapperModal.insertAdjacentHTML("beforeend", `
                <div class="modal-window__content">
                    <p class="modal-window__subject">
                        Вы заказали:
                        <!--<span class="modal-window__ingredients"></span>-->
                        
                    </p>
                    <button class="modal-window__submit-btn">
                        Закрыть
                    </button>
                </div>
          `);
          wrapperModal.classList.add("none");
      });

  }

});


