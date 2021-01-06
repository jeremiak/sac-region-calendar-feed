const express = require("express")
const ics = require("ics")

const scrapeSacBoardOfSupervisors = require("./scrapers/sac-board-of-supervisors.js")
const scrapeSacCityCouncil = require("./scrapers/sac-city-council.js")
const scrapeSCUSD = require("./scrapers/scusd-board.js")

const app = express()
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("OK")
})

app.get("/calendar.ics", (req, res) => {
  Promise.all([
    scrapeSacCityCouncil(),
    scrapeSCUSD(),
    scrapeSacBoardOfSupervisors(),
  ]).then((data) => {
    const [cityCouncilMeetings, scusdMeetings, supervisorMeetings] = data
    const meetings = [].concat(
      cityCouncilMeetings,
      scusdMeetings,
      supervisorMeetings
    )
    const { error, value } = ics.createEvents(meetings)

    if (error) {
      res.json({ error })
      return
    }
    res.json(meetings)
    return
    res.send(value)
  })
})

app.listen(port, "0.0.0.0", () => {
  console.log(`Up and running on port ${port}`)
})
