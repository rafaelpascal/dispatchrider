const routes = require("express").Router()
const {clientfeedback} = require ("../controllers/contactus") 

routes.route("/feedback").post(clientfeedback)

module.exports = routes