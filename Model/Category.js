const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:[true,"Category NAme is must Required"]
    },
    categoryImage:{
        type:String,
        required:[true,"Category Image is must Required"]
    },
})

const category = mongoose.model("category" , categorySchema)

module.exports = category