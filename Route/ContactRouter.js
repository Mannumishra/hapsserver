const { createContact, getContact } = require("../Controllar/ContactControllar")

const ContactRouter = require("express").Router()

ContactRouter.post("/contact" , createContact)
ContactRouter.get("/contact" , getContact)

module.exports = ContactRouter