const express = require("express")
const { httpAbortlaunch, httpGetAlllaunches, httpAddnewlaunch } = require("./launches.controller")

const launchesRouter = express.Router()
//check

launchesRouter.get("/", httpGetAlllaunches)
launchesRouter.post("/", httpAddnewlaunch)
launchesRouter.delete("/:id", httpAbortlaunch)

module.exports = launchesRouter
