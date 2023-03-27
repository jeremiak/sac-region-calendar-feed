const fs = require('fs/promises')
const ics = require("ics")
const moment = require('moment-timezone')

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
    const meetingsInTimezone = meetings.map(d => {
        const [year, month, date, hour, minute] = d.start
        const paddedMonth = `${month}`.padStart(2, '0')
        const paddedDate = `${date}`.padStart(2, '0')
        const paddedHour = `${hour}`.padStart(2, '0')
        const paddedMinute = `${minute}`.padStart(2, '0')
        const timestamp = `${year}-${paddedMonth}-${paddedDate} ${paddedHour}:${paddedMinute}`
        const start = moment.tz(timestamp, "America/Los_Angeles").utc().format('YYYY-M-D-H-m').split("-").map(val => parseInt(val))
        return {
            ...d,
            start,
            startInputType: 'utc'
        }
    })
    const { error, value } = ics.createEvents(meetingsInTimezone)

    await fs.writeFile('./generated/calendar.ics', value)
    await fs.writeFile('./generated/calendar.json', JSON.stringify(meetingsInTimezone, null, 2))
}

scrape()