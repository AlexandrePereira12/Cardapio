const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsConteiner = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressaWarn = document.getElementById("address-warn")

let cart = [];

//abrir modal do carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
    uptadeCartModal();
})

//fechar modal(clicando fora)
cartModal.addEventListener("click", function(event){
    if(event.target == cartModal){
        cartModal.style.display = "none"
    }
})

//fechar modal(clicando no "fechar")

closeModalBtn.addEventListener("click", function(event){
    cartModal.style.display = "none"
})

//adicionar ao carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name,price)
    }
})

function addToCart(name,price){
    const existingItem = cart.find(item => item.name === name)

// Se o item ja existir adicionado aumenta ha quantidade
    if(existingItem){
        existingItem.quantity += 1
    }else{
        cart.push({
            name,
            price,
            quantity: 1, 
        })
    }


        uptadeCartModal()

    }



//atualiza carrinho
function uptadeCartModal(){
    cartItemsConteiner.innerHTML = "";
    let total = 0;


    cart.forEach(item => {
    const cartItemElement = document.createElement("div")

    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
        <div>
            <p class="font-bold">${item.name}</p>
            <p class="font-medium mt-2">R$ ${item.price}</p>
            <p>Quantidade: ${item.quantity}</p>
        </div>

        <div>
            <button class="remove-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
    </div>
    `

    total += item.price * item.quantity;

    

    cartItemsConteiner.appendChild(cartItemElement)
    })
//converte o total para real
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

//Atualiza qnt de items no carrinho 
    cartCounter.innerHTML = cart.length;

}

//removendo item do carrinho

cartItemsConteiner.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            uptadeCartModal();
            return;
        }

        cart.splice(index, 1);
        uptadeCartModal();
    }
}

//endereço

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressaWarn.classList.add("hidden")
    }

})


//finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops restaurante está fechado no momento",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();
          
        return;
    }
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressaWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviando pedido para WPP

const cartItems = cart.map((item) => {
    return(` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}`)
}).join("")

const message = encodeURIComponent(cartItems)
const phone = "85992138755"

window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`)

cart.length = 0;
uptadeCartModal();

})


//verificação do horario do restaurante
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >=18 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}