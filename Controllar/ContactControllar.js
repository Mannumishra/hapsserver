const contact = require("../Model/ContactModel")

const createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body
        const errorMess = []
        if (!name) errorMess.push("Name is must required")
        if (!email) errorMess.push("email is must required")
        if (!phone) errorMess.push("phone is must required")
        if (!subject) errorMess.push("subject is must required")
        if (!message) errorMess.push("message is must required")
        if (errorMess.length > 0) {
            return res.status(401).json({
                success: false,
                message: errorMess.join(",")
            })
        }
        else {
            const olddata = await contact.findOne({
                $or: [{ email: req.body.email }, { phone: req.body.phone }]
            });
            console.log(olddata)
            if (olddata) {
                if (olddata.email === req.body.email) {
                    return res.status(409).json({
                        success: false,
                        message: "Email is already registered with us",
                    });
                } else if (olddata.phone === req.body.phone) {
                    return res.status(409).json({
                        success: false,
                        message: "Phone number is already registered with us",
                    });
                }
            }
            const data = new contact({ name, email, phone, message, subject })
            await data.save()
            res.status(200).json({
                success: true,
                message: "Your Query Send Successfully",
                data: data
            })
        }
    } catch (error) {
        res.status(500).json({
            success: true,
            message: "Internal Server Error"
        })
    }
}

const getContact = async (req, res) => {
    try {
        const data = await contact.find()
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Record  found successfully",
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
    createContact, getContact
}