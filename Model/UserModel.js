const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name field is must required"]
    },
    email: {
        type: String,
        required: [true, "email field is must required"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "phone field is must required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "passowrd field is must required"]
    },
    role: {
        type: String,
        default: "Buyer"
    },
    state: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    pin: {
        type: String,
        default: ""
    },
    pic: {
        type: String,
        default: ""
    },
    otp: {
        type: Number
    }
}, { timestamps: true })

const user = mongoose.model("User", userSchema)
module.exports = user