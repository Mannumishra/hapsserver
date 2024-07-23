const { createRecord, getRecord } = require("../Controllar/NewsletterControllar")

const NewsletterRouter = require("express").Router()

NewsletterRouter.post("/newsletter" , createRecord)
NewsletterRouter.get("/newsletter" , getRecord)

module.exports = NewsletterRouter