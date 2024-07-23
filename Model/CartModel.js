const mongoose = require("mongoose");

const cartSchema =new  mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    productid: {
        type: String,
        required: [true, "Product is is must required"]
    },
    productname: {
        type: String,
        required: [true, "Product is is must required"]
    },
    quantity: {
        type: Number,
        required: [true, "Product is is must required"]
    },
    sizeML: {
        type: String,
        required: [true, "Product is is must required"]
    },
    price: {
        type: Number,
        required: [true, "Product is is must required"]
    },
    image: {
        type: String,
        required: [true, "Product is is must required"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
