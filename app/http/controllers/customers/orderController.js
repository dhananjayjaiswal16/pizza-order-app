const Order = require('../../../models/order')
const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function orderController() {
    return {
        store(req, res) {
            const { phone, address, stripeToken, paymentType } = req.body;
            // console.log(phone, address);
            if (!phone || !address) {
                return res.status(422).json({ msg: 'Enter all required fields' });
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
                        //Stripe 
                        if (paymentType === 'card') {
                            stripe.charges.create({
                                amount: req.session.cart.totalPrice * 100,
                                source: stripeToken,
                                currency: 'INR',
                                description: `Pizza Order : ${placedOrder._id}`
                            }).then(() => {
                                //updating payment status in DB
                                placedOrder.paymentStatus = true;
                                placedOrder.paymentType = paymentType;
                                placedOrder.save()
                                    .then((result) => {
                                        // console.log('result', result);

                                        //event emitter
                                        delete req.session.cart;

                                        const eventEmitter = req.app.get('eventEmitter');
                                        eventEmitter.emit('orderPlaced', result);


                                        return res.json({ msg: 'Payment done and Order Placed!! Yayy!' });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            }).catch((err) => {
                                delete req.session.cart;
                                return res.json({ msg: 'Payment failed, Please pay at time of delivery' });
                            })
                        } else {
                            delete req.session.cart;

                            const eventEmitter = req.app.get('eventEmitter');
                            eventEmitter.emit('orderPlaced', placedOrder);

                            return res.json({ msg: 'Order placed succesfully! Pay at time of delivery' })
                        }

                    })

                })
                .catch(error => {
                    return res.status(500).json({ msg: 'Something went wrong' })

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