const { createRecord, getAllRecord, getSingleRecord, updateRecord, deleteRecord } = require("../Controllar/CategoryControllar")
const upload = require("../Middelware/Multer")

const categoryRouter = require("express").Router()

categoryRouter.post("/category",upload.single("categoryImage") , createRecord)
categoryRouter.put("/category/:_id",upload.single("categoryImage") , updateRecord)
categoryRouter.get("/category" , getAllRecord)
categoryRouter.get("/category/:_id" , getSingleRecord)
categoryRouter.delete("/category/:_id" , deleteRecord)

module.exports = categoryRouter