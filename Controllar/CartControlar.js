const Cart = require("../Model/CartModel")


const addItemToCart = async (req, res) => {
    try {
        console.log(req.body)
        let data = new Cart(req.body)
        await data.save()
        res.status(200).json({
            success: true,
            mess: "Cart is created",
            data: data
        })
    } catch (error) {
        console.log(error);
    }
}

const getCart = async (req, res) => {
    try {
        let data = await Cart.find({ userid: req.params.userid })
        res.status(200).json({
            success: true,
            mess: "Cart find",
            data: data
        })
    } catch (error) {
        console.log(error);
    }

}

const removeItemFromCart = async (req, res) => {
    try {
        let data = await Cart.findOne({ _id: req.params._id })
        await data.deleteOne()
        res.status(200).json({
            success: true,
            mess: "Cart Deleted"
        })
    } catch (error) {
        console.log(error);
    }
}
const updateCartItemQuantity = async (req, res) => {
    try {
        let data = await Cart.findOne({ _id: req.params._id })
        if (data) {
            console.log(req.body.quantity)
            data.quantity = req.body.quantity ?? data.quantity
            data.price = req.body.price ?? data.price
            await data.save()
            res.status(200).json({
                success:true,
                res:"Cart Updated",
                data:data
            })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addItemToCart: addItemToCart,
    getCart: getCart,
    removeItemFromCart: removeItemFromCart,
    updateCartItemQuantity: updateCartItemQuantity
}
