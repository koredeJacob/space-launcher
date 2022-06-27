const path = require("path")
const { createReadStream } = require("fs")
const { parse } = require("csv-parse")

const result = []

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
      .on("data", (chunk) => {
        if (habitable(chunk)) {
          result.push(chunk)
        }
      })
      .on("error", (error) => {
        console.log(error)
        reject(error)
      })
      .on("end", resolve)
  )
}

function getAllplanets() {
  return result
}

module.exports = {
  loadPlanetsdata,
  getAllplanets
}
