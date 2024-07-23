const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const user = require('../Model/UserModel');
const transporter = require('../Utils/Mailsender');
const { uploadimage } = require('../Utils/Cloudnary');

const schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)
    .is().max(15)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().symbols(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

const createRecord = async (req, res) => {
    try {
        console.log(req.body)
        let { name, email, phone, password } = req.body
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                mess: "Please Fill AllRequired Fields"
            })
        }
        if (req.body.password && schema.validate(req.body.password)) {
            let data = new user({ name, email, phone, password })
            bcrypt.hash(data.password, 12, async (error, hash) => {
                if (error) {
                    return res.status(500).json({
                        success: false,
                        mess: "Internal Server Error"
                    })
                }
                else {
                    data.password = hash
                    await data.save()
                    mailOptions = {
                        from: process.env.MAIL_SENDER,
                        to: data.email,
                        subject: "Account is Created : Team HAPS",
                        text: `
                                Hello ${data.name}
                                Your Account is Successfully Created
                                Now You Can Buy Our Latest Products with Great Deals
                                Team : HAPS
                            `
                    }
                    transporter.sendMail(mailOptions, ((error) => {
                        if (error) {
                            console.log(error)
                            return res.status(401).json({ success: false, message: "Invalid Email Address" })
                        }
                    }))
                    res.status(200).json({
                        success: true,
                        mess: "New User Accound Created Successfully",
                        data: data
                    })
                }
            })
        }
        else {
            return res.status(400).json({
                success: false,
                mess: "Password Must be greater then 8 charchars and less then 15 charchatrs and 1uppercase ,1lowelcase,1 digit,and 1symbol,and no space"
            })
        }
    } catch (error) {
        // console.log(error);
        if (error.keyValue.phone) {
            res.status(400).json({
                success: false,
                mess: "This phone is Aready Register With us "
            })
        }
        else if (error.keyValue.email) {
            res.status(400).json({
                success: false,
                mess: "This email is Aready Register With us "
            })
        }
        else {
            res.status(500).json({
                success: false,
                mess: "Internal Server Error"
            })
        }
    }
}
const getRecord = async (req, res) => {
    try {
        let data = await user.find()
        if (data) {
            res.status(200).json({
                success: true,
                mess: "UserRecord Found",
                data: data
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            mess: "Internal Server Error"
        })
    }
}
const getSingleRecord = async (req, res) => {
    try {
        let data = await user.findOne({ _id: req.params._id })
        if (data) {
            res.status(200).json({
                success: true,
                mess: "UserRecord Found",
                data: data
            })
        }
        else {
            res.status(400).json({
                success: false,
                mess: "UserRecord Not Found"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            mess: "Internal Server Error"
        })
    }
}
const updateRecord = async (req, res) => {
    try {
        let data = await user.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.phone = req.body.phone ?? data.phone
            data.address = req.body.address ?? data.address
            data.pin = req.body.pin ?? data.pin
            data.city = req.body.city ?? data.city
            data.state = req.body.state ?? data.state
            if (req.file) {
                const url = await uploadimage(req.file.path)
                data.pic = url
            }
            await data.save()
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            res.status(200).json({
                success: true,
                mess: "Profile Updated Successfully",
                data: data
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            mess: "Internal Server Error"
        })
    }
}
const login = async (req, res) => {
    try {
        console.log(req.body)
        let data = await user.findOne({ email: req.body.email })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                let key = data.role == "Admin" ? process.env.JWT_SALT_KEY_ADMIN : process.env.JWT_SALT_KEY_BUYER
                jwt.sign({ data }, key, { expiresIn: 1296000 }, (error, token) => {
                    if (error)
                        res.status(500).json({ success: false, message: "Internal Server Error" })
                    else
                        res.status(200).json({ success: true, data: data, token: token })
                })
            } else {
                return res.status(401).json({ success: false, message: "Invaild username or password" })
            }
        }
        else {
            return res.status(401).json({ success: false, message: "Invaild username or password" })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            mess: "Internal Server Error"
        })
    }
}
const forgetPassword1 = async (req, res) => {
    console.log("i am hit")
    console.log(req.body);
    try {
        var data = await user.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
            ]
        })
        console.log(data)
        if (data) {
            let otp = parseInt(Math.random() * 1000000)
            data.otp = otp
            await data.save()
            mailOptions = {
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: "OTP for Password Reset : Team Ricco",
                text: `
                        Hello ${data.name}
                        OTP for Password Reset is ${data.otp}
                        Please Never Share Your OTP With anyone
                        Team : Ricco
                    `
            }
            transporter.sendMail(mailOptions, ((error) => {
                if (error) {
                    return res.status(400).json({ success: false, message: "Invalid Email Address" })
                }
            }))
            res.status(200).json({ success: true, message: "OTP Sent on Your Registered Email Address" })
        }
        else
            return res.status(401).json({ success: false, message: "User Not Found" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
const forgetPassword2 = async (req, res) => {
    try {
        var data = await user.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
            ]
        })
        if (data) {
            if (data.otp == req.body.otp)
                res.status(200).json({ success: true, message: "Done" })
            else
                return res.status(401).json({ success: false, message: "Invalid OTP" })
        }
        else
            res.status(401).json({ success: false, message: "Anauthorized Activity" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
const forgetPassword3 = async (req, res) => {
    try {
        var data = await user.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
            ]
        })
        if (data) {
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                if (error)
                    return res.status(500).json({ success: false, message: "Internal Server Error" })
                else {
                    data.password = hash
                    await data.save()
                    res.status(200).json({ success: true, message: "Password Has Been Reset" })
                }
            })
        }
        else
            res.status(401).json({ success: false, message: "Anauthorized Activity" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

module.exports = {
    createRecord: createRecord,
    getSingleRecord: getSingleRecord,
    login: login,
    forgetPassword1: forgetPassword1,
    forgetPassword2: forgetPassword2,
    forgetPassword3: forgetPassword3,
    updateRecord: updateRecord,
    getRecord: getRecord
}