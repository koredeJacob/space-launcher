const {
  getAlllaunches,
  addNewlaunch,
  launchexist,
  abortlaunchbyid
} = require("../../models/launches.model")

function httpGetAlllaunches(req, res) {
  res.status(200).json(getAlllaunches())
}

function httpAddnewlaunch(req, res) {
  const launch = req.body

  if (!launch.launchDate || !launch.target || !launch.mission || !launch.rocket) {
    return res.status(400).json({
      error: "mission required launch property"
    })
  }
  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "invalid date"
    })
  }

  addNewlaunch(launch)
  res.status(201).json(launch)
}

function httpAbortlaunch(req, res) {
  const launchid = Number(req.params.id)

  if (!launchexist(launchid)) {
    return res.status(404).json({
      error: "launch not found"
    })
  }
  const aborted = abortlaunchbyid(launchid)
  return res.status(200).json(aborted)
}

module.exports = { httpGetAlllaunches, httpAddnewlaunch, httpAbortlaunch }
