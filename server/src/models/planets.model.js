const path = require("path")
const { createReadStream } = require("fs")
const { parse } = require("csv-parse")

const planets = require("./planets.mongo")

const habitable = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  )
}

async function loadPlanetsdata() {
  return new Promise((resolve, reject) =>
    createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data.csv"))
      .pipe(parse({ comment: "#", columns: true }))
      .on("data", async (chunk) => {
        if (habitable(chunk)) {
          await savePlanet(chunk)
        }
      })
      .on("error", (error) => {
        console.log(error)
        reject(error)
      })
      .on("end", async () => {
        console.log(`${(await getAllplanets()).length} habitable planets found`)
        resolve()
      })
  )
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name
      },
      { keplerName: planet.kepler_name },
      {
        upsert: true
      }
    )
  } catch (err) {
    console.error(`could not save planet ${err}`)
  }
}
async function getAllplanets() {
  return await planets.find({}, { _id: 0, __v: 0 })
}

module.exports = {
  loadPlanetsdata,
  getAllplanets
}
