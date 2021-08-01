import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
import moment from 'moment'; 

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





//Render Updated status front End
let allStatus = document.querySelectorAll('.status_line');

let current_order = document.getElementById('current-order'); 
let order;
if(current_order){
    order = current_order.value;
} else {
    order = null;
}
order = JSON.parse(order);
let time = document.createElement('small'); 

function updateStatus(order) {
//     console.log("Order : " +order);
    allStatus.forEach((status) => {
        status.classList.remove('completed');
        status.classList.remove('current');
    })
    let completed = true;
    allStatus.forEach((status)=> {
        let dataValue = status.dataset.current_status;
        if(completed){
            status.classList.add('completed');
        }
        if(dataValue === order.status){ 

            completed = false;
            time.innerHTML = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current'); 
            }
        }
    })    
}

updateStatus(order); 


//Socket.io
// Socket
let socket = io()
initAdmin(socket);
// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname

if(adminAreaPath.includes('admin')) {
    socket.emit('join', 'adminRoom');
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        progressBar: false,
        layout: 'bottomRight',
        text: " Order has been updated"
      }).show();
}) 