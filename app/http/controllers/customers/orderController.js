const Order = require('../../../models/order')
const moment = require('moment');
function orderController() {
    return {
        store(req, res){
            const { phone, address} = req.body;
            if(!phone && address){
                req.flash('error', 'Please Add your Phone Number')
                res.redirect('/cart') 
            } else if (!address && phone){
                req.flash('err', 'Please Add your Address')
                res.redirect('/cart')
            } else if (!phone && !address){
                req.flash('err', 'Please Add your Phone number and address')
                res.redirect('/cart')
            }
            const order = new Order({
                userId : req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address: address
            })
            order.save().then(result => {
                req.flash('success', 'Order Placed! Yayy!');
                delete req.session.cart;
                return res.redirect('/customers/orders');
            }).catch(error => {
                req.flash('err','Something went wrong') 
                return res.redirect('/cart');
            })
        },
        async index(req, res){
            //try{
                const orders = await Order.find({ userId : req.user._id},
                    null,
                    { sort :{'createdAt': -1}}    
                );
                res.render('customers/orders', {orders: orders, moment: moment});
            // }catch(err){
            //     next(err); 
            // }
        }
    }
    
}

module.exports = orderController;