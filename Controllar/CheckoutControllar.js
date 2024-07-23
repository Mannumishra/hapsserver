const Checkout = require("../Model/CheckoutModel");


const placeOrder = async (req, res) => {
    try {
        const { userid, subtotal, shipping, total, products, paymentmode } = req.body;
        // console.log(req.body)
        const newCheckout = new Checkout({ userid, subtotal, shipping, total, paymentmode, products });
        await newCheckout.save();
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: newCheckout
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to place order"
        });
    }
};
const getUserRecord = async (req, res) => {
    try {
        let data = await Checkout.find({ userid: req.params.userid })
        res.status(200).json({
            success: true,
            message: "done",
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getRecord = async (req, res) => {
    try {
        let data = await Checkout.find()
        res.status(200).json({
            success: true,
            mess: "Order Found",
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
const getSingleOrder = async (req, res) => {
    try {
        let Singledata = await Checkout.findOne({ _id: req.params._id })
        console.log(Singledata)
        res.status(200).json({
            success: true,
            mess: "Order Found",
            data: Singledata
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateOrderRecord = async (req, res) => {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
        if (data) {
            data.orderstatus = req.body.orderstatus ?? data.orderstatus
            data.paymentmode = req.body.paymentmode ?? data.paymentmode
            data.paymentstatus = req.body.paymentstatus ?? data.paymentstatus
            // data.rppid = req.body.rppid ?? data.rppid
            await data.save()
            res.status(200).json({ success:true, message: "Record Updated" })
        }
        else
            res.status(401).json({ success:false,  message: "Record Not Found" })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    placeOrder: placeOrder,
    getUserRecord: getUserRecord,
    getRecord: getRecord,
    getSingleOrder: getSingleOrder,
    updateOrderRecord:updateOrderRecord
}
