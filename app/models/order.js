const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {type: Object, required:true },
    phone: {type : Number, required: true},
    address: {type : String, required: true},
    paymentType: {type:String, default: 'Cash on Delivery' }, 
    status: {type: String, default: 'order_placed'}
},{
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;