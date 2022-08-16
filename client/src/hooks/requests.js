const APP_URL = "v1"

async function httpGetPlanets() {
  // Load planets and return as JSON.
  const response = await fetch(`${APP_URL}/planets`)
  return await response.json()
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  const response = await fetch(`${APP_URL}/launches`)
  const fetchedlaunches = await response.json()
  return fetchedlaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
}

// TODO: Once API is ready.

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${APP_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch)
    })
  } catch (err) {
    return {
      ok: "false"
    }
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${APP_URL}/launches/${id}`, {
      method: "delete"
    })
  } catch (err) {
    return {
      ok: "false"
    }
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch }
