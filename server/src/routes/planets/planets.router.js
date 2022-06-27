const express = require("express")
const { httpGetAllplanets } = require("./planets.controller")

const planetsrouter = express.Router()

planetsrouter.get("/", httpGetAllplanets)

module.exports = planetsrouter
