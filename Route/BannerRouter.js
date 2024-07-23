const { createBanner, getBanner, updateRecord, getSingleRecord, deleteBanner } = require("../Controllar/BannerControllar")
const upload = require("../Middelware/Multer")

const BannerRouter = require("express").Router()

BannerRouter.post("/banner", upload.single("bannerImage"), createBanner)
BannerRouter.get("/banner", getBanner)
BannerRouter.get("/banner/:_id", getSingleRecord)
BannerRouter.delete("/banner/:_id", deleteBanner)
BannerRouter.put("/banner/:_id", upload.single("bannerImage"), updateRecord)

module.exports = BannerRouter