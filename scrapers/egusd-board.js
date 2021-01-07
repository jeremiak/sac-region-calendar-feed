const cheerio = require("cheerio")
const { timeParse } = require("d3-time-format")
const fetch = require("isomorphic-fetch")

const url = 'http://www.egusd.net/about/leadership/board-of-education/board-meeting-schedule/'
const parseDate = timeParse('%B %e, %Y')

async function scrapeEGUSDBoard() {
    const req = await fetch(url)
    const text = await req.text()
    const $ = cheerio.load(text)
    const calendarIcon = $('.wp-svg-calendar.calendar')
    const h3 = calendarIcon.closest('h3')
    const ul = h3.next('ul')
    const lis = ul.find('li')
    const meetings = []

    lis.each(function(i, li) {
        const text = $(li).text()
        const [date, ...match] = text.match(/^(\w+\s\d+,\s\d{4})/)
        const isRescheduled = text.includes('Rescheduled')
        const isWorkshop = text.includes('Board Workshop')

        if (isRescheduled) return

        const parsedDate = parseDate(date)
        const title = isWorkshop ? 'EGUSD Board Workshop' : 'EGUSD Board Meeting'
        const start = [
            parsedDate.getFullYear(),
            parsedDate.getMonth() + 1,
            parsedDate.getDate(),
            isWorkshop ? 8 : 18,
            isWorkshop ? 30 : 0,
        ]
        const duration = {
            hours: isWorkshop ? 6 : 4,
            minutes: isWorkshop ? 30 : 0
        }

        meetings.push({
            title,
            description: '',
            start,
            duration,
        })
    })

    return meetings
}

module.exports = scrapeEGUSDBoard