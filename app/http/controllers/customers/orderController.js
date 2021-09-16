const Order = require('../../../models/order')
const moment = require('moment');
function orderController() {
    return {
        store(req, res) {
            const { phone, address } = req.body;
            console.log(phone, address);
            if (!phone || !address) {
                return res.json({ msg: 'Enter all required fields' });
                // req.flash('error', 'Enter all required fields')
                // res.redirect('/cart')
            }
            const order = new Order({
                userId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save()
                .then(result => {
                    Order.populate(result, { path: 'userId' }, (err, placedOrder) => {
                        // req.flash('success', 'Order Placed! Yayy!');
                        delete req.session.cart;

                        //event emitter
                        const eventEmitter = req.app.get('eventEmitter');
                        eventEmitter.emit('orderPlaced', placedOrder);
                        return res.json({ msg: 'Order Placed! Yayy!' });
                        // return res.redirect('/customers/orders');
                    })

                })
                .catch(error => {
                    return res.json({ msg: 'Something went wrong' })
                    //return res.redirect('/cart');
                })
        },
        async index(req, res) {
            try {
                const orders = await Order.find({ userId: req.user._id },
                    null,
                    { sort: { 'createdAt': -1 } }
                );
                res.render('customers/orders', { orders: orders, moment: moment });
            } catch (err) {
                next(err);
            }
        },
        async display(req, res) {
            const order = await Order.findById(req.params.id);
            // Prevent user from getting into another route
            if (req.user._id.toString() === order.userId.toString()) {
                res.render('customers/singleOrder', { order: order });
            } else {
                res.redirect('/');
            }
        }
    }

}

module.exports = orderController;