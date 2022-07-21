const {
  getAlllaunches,
  saveNewlaunch,
  launchexist,
  abortlaunchbyid
} = require("../../models/launches.model")

const { getPagination } = require("../../services/query")

async function httpGetAlllaunches(req, res) {
  const { skip, limit } = getPagination(req.query)
  const launches = getAlllaunches(skip, limit)
  res.status(200).json(await launches)
}

async function httpAddnewlaunch(req, res) {
  const launch = req.body

  if (!launch.launchDate || !launch.target || !launch.mission || !launch.rocket) {
    return res.status(400).json({
      error: "missing required launch property"
    })
  }
  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "invalid date"
    })
  }

  await saveNewlaunch(launch)
  res.status(201).json(launch)
}

async function httpAbortlaunch(req, res) {
  const launchid = Number(req.params.id)

  const validlaunch = await launchexist(launchid)
  if (!validlaunch) {
    return res.status(404).json({
      error: "launch not found"
    })
  }
  const aborted = await abortlaunchbyid(launchid)
  if (!aborted) {
    return res.status(400).json({
      error: "launch not aborted"
    })
  }
  return res.status(200).json({
    ok: true
  })
}

module.exports = { httpGetAlllaunches, httpAddnewlaunch, httpAbortlaunch }
