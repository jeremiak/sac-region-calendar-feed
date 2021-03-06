const express = require("express")
const ics = require("ics")

const scrapeCHCityCouncil = require("./scrapers/ch-city-council.js")
const scrapeEGCityCouncil = require("./scrapers/eg-city-council.js")
const scrapeEGUSD = require("./scrapers/egusd-board.js")
const scrapeSJUSDBoard = require("./scrapers/sjusd-board.js")
const scrapeSacBoardOfSupervisors = require("./scrapers/sac-board-of-supervisors.js")
const scrapeSacCityCouncil = require("./scrapers/sac-city-council.js")
const scrapeSCUSD = require("./scrapers/scusd-board.js")

const app = express()
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("OK")
})

app.get("/calendar.:format", (req, res) => {
  const { format } = req.params
  Promise.all([
    scrapeSacBoardOfSupervisors(),
    scrapeSacCityCouncil(),
    scrapeSCUSD(),
    scrapeEGUSD(),
    scrapeEGCityCouncil(),
    // scrapeCHCityCouncil(),
    scrapeSJUSDBoard(),
  ]).then((data) => {
    const meetings = [].concat(...data)

    // this just stomps all over any of the other description
    // fields/values that have been used. This is mostly because
    // Jeremia is lazy and didn't want to go change this in
    // all the different scraper handlers
    const meetingsWithDefaultDescription = meetings.map((m) => {
      return {
        ...m,
        description: `Sign up to take notes for this meeting at https://www.socialjusticesac.org/meeting-sign-up`,
      }
    })
    const { error, value } = ics.createEvents(meetingsWithDefaultDescription)

    if (error) {
      res.json({ error })
      return
    }

    if (format === "json") {
      return res.json(meetingsWithDefaultDescription)
    }

    if (format === "ics") {
      return res.send(value)
    }

    return res.status(404)
  })
})

app.listen(port, "0.0.0.0", () => {
  console.log(`Up and running on port ${port}`)
})
