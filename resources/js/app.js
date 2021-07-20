import axios from 'axios';
import Noty from 'noty';
let addToCart =  document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('.cartCounter');

function updateCart(pizza){
    // to add data to cart
    //Ajax call
    axios.post('/update-cart', pizza)
    .then(res => {
        
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            layout: 'bottomRight',
            text: pizza.name +  " Pizza added to cart"
          }).show();
    })
    .catch(error =>  {
        console.log("err: " + error); 
    });
}





addToCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        //Fetch data sent from database
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza) 
    });
})