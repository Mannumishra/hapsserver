const newsletter = require("../Model/Newsletter")
const transporter = require("../Utils/Mailsender")

const createRecord = async (req, res) => {
    try {
        const { email } = req.body
        console.log(req.body)
        console.log("I am hit")
        if (!email) {
            return res.status(401).json({
                success: false,
                message: "Please fill Email"
            })
        }
        else {
            const oldEmail = await newsletter.findOne({ email: req.body.email })
            if (oldEmail) {
                return res.status(401).json({
                    success: false,
                    message: "This Email id is already subscribe"
                })
            }
            const data = new newsletter({ email })
            await data.save()
            const sendMail = {
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: "Welcome to HAPS Newsletter!",
                text: `
                    Dear Subscriber,
            
                    Thank you for subscribing to the HAPS newsletter! We're excited to have you on board.
            
                    As a subscriber, you'll be the first to know about our latest products, exclusive deals, and special offers. Stay tuned for updates on our best-selling items and new arrivals.
            
                    If you have any questions or need assistance, feel free to contact our support team.
            
                    Happy shopping!
            
                    Best regards,
                    The HAPS Team
                `
            };
            transporter.sendMail(sendMail, ((error) => {
                if (error) {
                    console.log(error)
                    return res.status(401).json({ success: false, message: "Invalid Email Address" })
                }
            }))
            res.status(200).json({
                success: true,
                message: "Newsletter Subcribe Successfully",
                data: data
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getRecord = async (req, res) => {
    try {
        const data = await newsletter.find()
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Newsletter Not Found"
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Newsletter Found Successfully",
                data: data
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord, getRecord
}