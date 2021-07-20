//const { json } = require("express");

function cartController(){
    //factory function: returns object
    return {
        index(req, res) {
            res.render("customers/cart");
        },
        update(req, res){
            //console.log("cartController's session req : " + req.session.cart.totalPrice);
            //creating cart and its object structure
            //console.log("cartContoller Session = "+req.session.cart);
            if(!req.session.cart){
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                } 
            }
            let cart = req.session.cart;
            //console.log(req.body);
            //Add data to cart if not present
            if(!cart.items[req.body._id]){
                cart.items[req.body._id] = {
                    items: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            } else { // Update cart data
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            } 
            return res.json({totalQty: req.session.cart.totalQty}); 
            
        }
    }
}

module.exports = cartController;