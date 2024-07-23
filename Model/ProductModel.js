const mongoose = require("mongoose");

const SizesSchema = new mongoose.Schema({
    sizeML: {
        type: Number,
        required: [true, "Size in ml is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        required: [true, "Final price is required"]
    },
    stock: {
        type: Number,
        default: 0
    }
});

const productSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: [true, "Category name is required"]
    },
    productName: {
        type: String,
        required: [true, "Product name is required"]
    },
    productDescription: {
        type: String,
        required: [true, "Product description is required"]
    },
    productSubDescription: {
        type: String,
        required: [true, "Product sub-description is required"]
    },
    productDetails: {
        type: String,
        required: [true, "Product details are required"]
    },
    productSize: {
        type: [SizesSchema],
        required: [true, "Product size is required"]
    },
    productImage1: {
        type: String,
    },
    productImage2: {
        type: String,
    },
    productImage3: {
        type: String,
    },
    productImage4: {
        type: String,
    },
    productImage5: {
        type: String,
    },
    productImage6: {
        type: String,
    },
    productImage7: {
        type: String,
    },
    productImage8: {
        type: String,
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
