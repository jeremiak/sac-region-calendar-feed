const fs = require('fs/promises')
const ics = require("ics")

// const scrapeCHCityCouncil = require("./scrapers/ch-city-council.js")
const scrapeEGCityCouncil = require("./scrapers/eg-city-council.js")
const scrapeEGUSD = require("./scrapers/egusd-board.js")
const scrapeSJUSDBoard = require("./scrapers/sjusd-board.js")
const scrapeSacBoardOfSupervisors = require("./scrapers/sac-board-of-supervisors.js")
const scrapeSacCityCouncil = require("./scrapers/sac-city-council.js")
const scrapeSCUSD = require("./scrapers/scusd-board.js")

async function scrape() {
    const data = await Promise.all([
        scrapeSacBoardOfSupervisors(),
        scrapeSacCityCouncil(),
        scrapeSCUSD(),
        scrapeEGUSD(),
        scrapeEGCityCouncil(),
        scrapeSJUSDBoard(),
    ])


    const meetings = [].concat(...data)
    const { error, value } = ics.createEvents(meetings)

    await fs.writeFile('./generated/calendar.ics', value)
    await fs.writeFile('./generated/calendar.json', JSON.stringify(meetings, null, 2))
}

scrape()