const Checkout = require("../Model/CheckoutModel");
const razorpay = require('razorpay');
const crypto = require('crypto');

var instance = new razorpay({
    key_id: process.env.RAZORPAY_API_KEY || "rzp_test_XPcfzOlm39oYi8",
    key_secret: process.env.RAZORPAY_API_SECRET || "Q79P6w7erUar31TwW4GLAkpa",
});

const placeOrder = async (req, res) => {
    try {
        const { userid, total, products, paymentmode } = req.body;
        if (!userid || !total || !products || !paymentmode) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        if (paymentmode === "COD") {
            const newCheckout = new Checkout({ userid, total, paymentmode, products });
            await newCheckout.save();
            return res.status(200).json({
                success: true,
                message: "Order placed successfully",
                data: newCheckout
            });
        } else {
            const options = {
                amount: Math.round(total * 100),
                currency: "INR",
                receipt: `OrderForProduct_${Date.now()}`,
            };
            const razorpayOrder = await instance.orders.create(options);
            if (!razorpayOrder) {
                return res.status(500).send('Some error occurred while creating the Razorpay order.');
            }
            const newCheckout = new Checkout({
                razorpayOrderId: razorpayOrder.id,
                userid,
                total,
                paymentmode,
                products,
                paymentstatus: razorpayOrder.status
            });
            await newCheckout.save();
            return res.status(200).json({
                success: true,
                message: "Order placed successfully",
                data: newCheckout,
                order: razorpayOrder
            });
        }
    } catch (error) {
        console.error("Place Order Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
};

const paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing required payment details',
            });
        }
        const order = await Checkout.findOne({ razorpayOrderId: razorpay_order_id });
        if (!order) {
            return res.status(403).json({
                success: false,
                message: "Order not found"
            });
        }
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET || "Q79P6w7erUar31TwW4GLAkpa")
            .update(body)
            .digest("hex");
        if (expectedSignature === razorpay_signature) {
            const updatedOrder = await Checkout.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    $set: {
                        transactionId: razorpay_payment_id,
                        PaymentDone: true,
                        paymentstatus: "Success"
                    }
                },
                { new: true }
            );

            if (!updatedOrder) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update order status"
                });
            }
            res.redirect(`${process.env.FRONTEND_URL}/Payment-Success?Payment=Done&Order=${updatedOrder._id}`);
        } else {
            res.redirect(`${process.env.FRONTEND_URL}/Payment-failed?Payment=Failed`);
        }
    } catch (error) {
        console.error("Payment Verification Error: ", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during payment verification",
            error: error.message
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
            res.status(200).json({ success: true, message: "Record Updated" })
        }
        else
            res.status(401).json({ success: false, message: "Record Not Found" })
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
    paymentVerification: paymentVerification,
    getSingleOrder: getSingleOrder,
    updateOrderRecord: updateOrderRecord
}
