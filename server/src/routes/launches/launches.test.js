const request = require("supertest")
const app = require("../../app")

describe("Test GET /launches", () => {
  test("It should respond with 200", async () => {
    await request(app).get("/launches").expect("Content-Type", /json/).expect(200)
  })
})

describe("Test POST /launches", () => {
  const completealaunchdata = {
    mission: "uss enterprise",
    rocket: "NCC 1071-V",
    target: "Kepler-186 f",
    launchDate: "january 27, 2023"
  }

  const launchdatawithoutdate = {
    mission: "uss enterprise",
    rocket: "NCC 1071-V",
    target: "Kepler-186 f"
  }

  const launchwithinvaliddate = {
    mission: "uss enterprise",
    rocket: "NCC 1071-V",
    target: "Kepler-186 f",
    launchDate: "zazu"
  }

  test("It should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
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
      .post("/launches")
      .send(launchdatawithoutdate)
      .expect("Content-Type", /json/)
      .expect(400)

    expect(response.body).toStrictEqual({ error: "mission required launch property" })
  })

  test("It should catch invalid date", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchwithinvaliddate)
      .expect("Content-Type", /json/)
      .expect(400)

    expect(response.body).toStrictEqual({ error: "invalid date" })
  })
})
