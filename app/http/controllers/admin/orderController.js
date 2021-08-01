
const Order = require('../../../models/order');

function orderController() {
    return {
        index(req, res) {
           Order.find({ status: { $ne: 'delivered' } }, null, { sort: { 'createdAt': -1 }}).populate('userId', '-password').exec((err, orders) => {
               if(req.xhr) {
                   return res.json(orders);
               } else {
                return res.render('admin/orders');
               }
           })
        }
    }
}

module.exports = orderController;