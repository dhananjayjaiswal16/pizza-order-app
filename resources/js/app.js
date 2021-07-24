import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';

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



//alert msg in order.ejs 
let alerts_msg = document.querySelector('#success-alert');
console.log("Alerts" + alerts_msg);
if(alerts_msg){ 
    console.log("Alerts inside If" + alerts_msg);
    setTimeout(() => {
        alerts_msg.remove()
    }, 1800)
}



initAdmin()