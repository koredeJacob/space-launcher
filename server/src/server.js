const http = require("http")

const app = require("./app")
const { loadPlanetsdata } = require("./models/planets.model")

const server = http.createServer(app)

const PORT = process.env.PORT || 8000

async function serve() {
  await loadPlanetsdata()
  server.listen(PORT, () => {
    console.log(`listening on ${PORT}...`)
  })
}
serve()
