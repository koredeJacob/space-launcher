const mongoose = require("mongoose")

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.on("open", () => {
  console.log("connection ready")
})

mongoose.connection.on("error", (err) => {
  console.error(err)
})
async function mongoconnect() {
  await mongoose.connect(MONGO_URL)
}

async function mongodisconnect() {
  await mongoose.disconnect()
}

module.exports = {
  mongoconnect,
  mongodisconnect
}
