const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
        required: [true, "Banner Image is must Required"]
    }
})

const banner = mongoose.model("Banner", bannerSchema)

module.exports = banner