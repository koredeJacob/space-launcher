const axios = require("axios")

const launchesDatabase = require("./launches.mongo")
const planets = require("./planets.mongo")

const DEFAULT_FLIGHTNUMBER = 100
const SPACEXURL = "https://api.spacexdata.com/v4/launches/query"

async function populatelaunches() {
  const response = await axios.post(SPACEXURL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1
          }
        },
        {
          path: "payloads",
          select: {
            customers: 1
          }
        }
      ]
    }
  })
  if (response.status != 200) {
    console.log("problem downloading launch data")
    throw new Error("launch data download failed")
  }

  const launchdocs = response.data.docs

  for (const launchdoc of launchdocs) {
    const payloads = launchdoc["payloads"]
    const customers = payloads.flatMap((payload) => {
      return payload["customers"]
    })
    const launch = {
      flightNumber: launchdoc["flight_number"],
      mission: launchdoc["name"],
      rocket: launchdoc["rocket"]["name"],
      launchDate: launchdoc["date_local"],
      upcoming: launchdoc["upcoming"],
      success: launchdoc["success"],
      customers
    }
    console.log(`${launch.flightNumber}`)
    await saveLaunch(launch)
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter)
}

async function loadLaunchData() {
  const firstlaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat"
  })
  if (firstlaunch) {
    console.log("launch data already exists")
  } else {
    await populatelaunches()
  }
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber")

  if (!latestLaunch) {
    return DEFAULT_FLIGHTNUMBER
  }

  return latestLaunch.flightNumber
}

async function getAlllaunches(skip, limit) {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit)
}

async function saveNewlaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  })

  if (!planet) {
    throw new Error("planet not found")
  }

  const newflightnumber = (await getLatestFlightNumber()) + 1
  Object.assign(launch, {
    flightNumber: newflightnumber,
    upcoming: true,
    success: true,
    customers: ["NASA", "SPACE X"]
  })

  await saveLaunch(launch)
}

async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, {
    upsert: true
  })
}

async function launchexist(launchid) {
  return await launchesDatabase.findOne(
    {
      flightNumber: launchid
    },
    { _id: 0, __v: 0 }
  )
}

async function abortlaunchbyid(launchid) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchid
    },
    {
      upcoming: false,
      success: false
    }
  )
  return aborted.modifiedCount === 1
}

module.exports = {
  loadLaunchData,
  getAlllaunches,
  saveNewlaunch,
  launchexist,
  abortlaunchbyid
}
