const express = require("express")

const scrapeSacBoardOfSupervisors = require("./scrapers/sac-board-of-supervisors.js")
const scrapeSacCityCouncil = require("./scrapers/sac-city-council.js")
const scrapeSCUSD = require("./scrapers/scusd-board.js")

const app = express()
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("OK")
})

app.get("/calendar.ics", (req, res) => {
  console.log("Got request")
  Promise.all([
    scrapeSacCityCouncil(),
    scrapeSacBoardOfSupervisors(),
    scrapeSCUSD(),
  ]).then(([cityCouncilMeetings, supervisorMeetings, scusdMeetings]) => {
    console.log("Scrapes done")
    const meetings = [].concat(
      scusdMeetings,
      cityCouncilMeetings,
      supervisorMeetings
    )
    res.json(meetings)
  })
})

app.listen(port, "0.0.0.0", () => {
  console.log(`Up and running on port ${port}`)
})
