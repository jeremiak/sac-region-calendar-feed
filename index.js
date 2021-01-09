const express = require("express")
const ics = require("ics")

const scrapeCHCityCouncil = require('./scrapers/ch-city-council.js')
const scrapeEGCityCouncil = require('./scrapers/eg-city-council.js')
const scrapeEGUSD = require("./scrapers/egusd-board.js")
const scrapeSJUSDBoard = require('./scrapers/sjusd-board.js')
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
    scrapeCHCityCouncil(),
    scrapeSJUSDBoard(),
  ]).then((data) => {

    const meetings = [].concat(...data)
    const { error, value } = ics.createEvents(meetings)

    if (error) {
      res.json({ error })
      return
    }

    if (format === 'json') {
      return res.json(meetings)
    }

    if (format === 'ics') {
      return res.send(value)
    }

    return res.status(404)
  })
})

app.listen(port, "0.0.0.0", () => {
  console.log(`Up and running on port ${port}`)
})
