require("dotenv").config()
const request = require("supertest")
const app = require("../../app")
const { mongoconnect, mongodisconnect } = require("../../services/mongo")

describe("Launches API", () => {
  beforeAll(async () => await mongoconnect())
  afterAll(async () => await mongodisconnect())

  describe("Test GET /launches", () => {
    test("It should respond with 200", async () => {
      await request(app).get("/v1/launches").expect("Content-Type", /json/).expect(200)
    })
  })

  describe("Test POST /launches", () => {
    const completealaunchdata = {
      mission: "uss enterprise",
      rocket: "NCC 1071-V",
      target: "Kepler-62 f",
      launchDate: "january 27, 2023"
    }

    const launchdatawithoutdate = {
      mission: "uss enterprise",
      rocket: "NCC 1071-V",
      target: "Kepler-62 f"
    }

    const launchwithinvaliddate = {
      mission: "uss enterprise",
      rocket: "NCC 1071-V",
      target: "Kepler-62 f",
      launchDate: "zazu"
    }

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completealaunchdata)
        .expect("Content-Type", /json/)
        .expect(201)

      const respondedate = new Date(response.body.launchDate).valueOf()
      const requestdate = new Date(completealaunchdata.launchDate).valueOf()

      expect(respondedate).toBe(requestdate)

      expect(response.body.upcoming).toBe(true)
      expect(response.body).toMatchObject(launchdatawithoutdate)
    })

    test("Should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchdatawithoutdate)
        .expect("Content-Type", /json/)
        .expect(400)

      expect(response.body).toStrictEqual({ error: "missing required launch property" })
    })

    test("It should catch invalid date", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchwithinvaliddate)
        .expect("Content-Type", /json/)
        .expect(400)

      expect(response.body).toStrictEqual({ error: "invalid date" })
    })
  })
})
