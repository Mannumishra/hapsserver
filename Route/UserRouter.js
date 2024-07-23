const { createRecord, getSingleRecord, getRecord, updateRecord, login, forgetPassword1, forgetPassword2, forgetPassword3 } = require("../Controllar/UserControllar")
const upload = require("../Middelware/Multer")

const userRouter = require("express").Router()

userRouter.post("/user", createRecord)
userRouter.get("/user/:_id", getSingleRecord)
userRouter.get("/user", getRecord)
userRouter.put("/user/:_id", upload.single("pic"), updateRecord)
userRouter.post("/user/login", login)
userRouter.post("/user/forgetpassword1", forgetPassword1)
userRouter.post("/user/forgetpassword2", forgetPassword2)
userRouter.post("/user/forgetpassword3", forgetPassword3)

module.exports = userRouter