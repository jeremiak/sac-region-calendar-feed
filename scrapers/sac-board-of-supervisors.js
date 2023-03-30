const cheerio = require("cheerio")
const { timeParse } = require("d3-time-format")
const fetch = require("isomorphic-fetch")

const url = "https://saccounty.mhsoftware.com/rss/calendar_id/3.xml"

const parseDate = timeParse("%a, %e %b %Y %_I:%M:%S %Z")

function getStartArrayAdjustedForTimezone(date) {
    const formattingOptions = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'America/Los_Angeles'
    }
    const adjusted = new Intl.DateTimeFormat('en-us', formattingOptions).format(date)
    const [datePart, timePart] = adjusted.split(', ')
    const [month, day, year] = datePart.split('/')
    const [hourMinutePart, partOfDay] = timePart.split(' ')
    const [hour, minute] = hourMinutePart.split(':')
    const start = [+year, +month, +day,
        partOfDay === 'PM' ? +hour + 12 : +hour, +minute,

    ]
    return start
}

async function scrapeSacBoardOfSupervisors() {
    const req = await fetch(url)
    const text = await req.text()
    const $ = cheerio.load(text, { xmlMode: true })

    const items = $("item")

    const data = []
    items.each(function(index, item) {
        const $$ = $(this)

        const title = $$.find("title").text()
        const description = $$.find("description").text()
        const link = $$.find("link").text()
        const guid = $$.find("guid").text()
        const startDate = $$.find("cdaily\\:eventStartDate").text()

        const isBoardMeeting = title.toLowerCase().includes("board of supervisors")
        if (!isBoardMeeting) return

        const date = parseDate(startDate)
        const start = getStartArrayAdjustedForTimezone(date)

        data.push({
            title: "Sac County Board of Supervisors Meeting",
            description: `Sign up to take notes for this meeting at https://www.socialjusticesac.org/wix-sac-bos`,
            url: link,
            uid: guid,
            start,
            duration: { hours: 2 },
        })
    })

    return data
}

module.exports = scrapeSacBoardOfSupervisors