const { createRecord, getRecord, getSingleRecord, deleteRecord, updateRecord } = require("../Controllar/ProductControllar")
const upload = require("../Middelware/Multer")

const ProductRouter = require("express").Router()

ProductRouter.post("/product", upload.fields([
    { name: "productImage1", maxCount: 1 },
    { name: "productImage2", maxCount: 1 },
    { name: "productImage3", maxCount: 1 },
    { name: "productImage4", maxCount: 1 },
    { name: "productImage5", maxCount: 1 },
    { name: "productImage6", maxCount: 1 },
    { name: "productImage7", maxCount: 1 },
    { name: "productImage8", maxCount: 1 },
]), createRecord)

ProductRouter.put("/product/:_id", upload.fields([
    { name: "productImage1", maxCount: 1 },
    { name: "productImage2", maxCount: 1 },
    { name: "productImage3", maxCount: 1 },
    { name: "productImage4", maxCount: 1 },
    { name: "productImage5", maxCount: 1 },
    { name: "productImage6", maxCount: 1 },
    { name: "productImage7", maxCount: 1 },
    { name: "productImage8", maxCount: 1 },
]), updateRecord)

ProductRouter.get("/product" , getRecord)
ProductRouter.get("/product/:_id" , getSingleRecord)
ProductRouter.delete("/product/:_id" , deleteRecord)

module.exports = ProductRouter