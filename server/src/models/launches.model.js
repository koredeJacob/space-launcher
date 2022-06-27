const launches = new Map()

let latestfligthnumber = 100

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Exploration IS1",
  launchDate: new Date("December 27, 2033"),
  target: "Kepler-442 b",
  customers: ["NASA", "SPACE X"],
  upcoming: true,
  success: true
}

launches.set(launch.flightNumber, launch)

function getAlllaunches() {
  return Array.from(launches.values())
}

function addNewlaunch(launch) {
  latestfligthnumber += 1
  launches.set(
    latestfligthnumber,
    Object.assign(launch, {
      flightNumber: latestfligthnumber,
      upcoming: true,
      success: true,
      customers: ["NASA", "SPACE X"]
    })
  )
}

function launchexist(launchid) {
  return launches.has(launchid)
}

function abortlaunchbyid(launchid) {
  const aborted = launches.get(launchid)

  aborted.upcoming = false
  aborted.success = false

  return aborted
}

module.exports = {
  getAlllaunches,
  addNewlaunch,
  launchexist,
  abortlaunchbyid
}
