const express = require("express")

const scrapeSacBoardOfSupervisors = require("./scrapers/sac-board-of-supervisors.js")
const scrapeSacCityCouncil = require("./scrapers/sac-city-council.js")
const scrapeSCUSD = require("./scrapers/scusd-board.js")

const app = express()
const port = process.env.PORT | 3000

app.get("/calendar.ics", async (req, res) => {
  const cityCouncilMeetings = await scrapeSacCityCouncil()
  const supervisorMeetings = await scrapeSacBoardOfSupervisors()
  const scusdMeetings = await scrapeSCUSD()
  const meetings = [].concat(
    scusdMeetings,
    cityCouncilMeetings,
    supervisorMeetings
  )
  res.json(meetings)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
