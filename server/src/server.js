const http = require("http")

const app = require("./app")
const { loadPlanetsdata } = require("./models/planets.model")
const { mongoconnect } = require("./services/mongo")
const { loadLaunchData } = require("./models/launches.model")

const server = http.createServer(app)

const PORT = process.env.PORT || 8000

async function serve() {
  await mongoconnect()
  await loadPlanetsdata()
  await loadLaunchData()
  server.listen(PORT, () => {
    console.log(`listening on ${PORT}...`)
  })
}
serve()
