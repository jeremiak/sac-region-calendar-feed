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

      const match = text.match(/^(\w+\s\d+,\s\d{4})/)

      // There was a date where the meetings weren't parsed because its a two date range. However, that date is in the past so let's just skip it and move on.
      if (!match) return

      const date = match[0]
      const isRescheduled = text.includes("Rescheduled")
      const isWorkshop = text.includes("Board Workshop")

      if (isRescheduled) return

      const parsedDate = parseDate(date)
      const title = isWorkshop ? "EGUSD Board Workshop" : "EGUSD Board Meeting"
      const start = [
        parsedDate.getFullYear(),
        parsedDate.getMonth() + 1,
        parsedDate.getDate(),
        isWorkshop ? 8 : 18,
        isWorkshop ? 30 : 0,
      ]
      const duration = {
        hours: isWorkshop ? 6 : 4,
        minutes: isWorkshop ? 30 : 0,
      }

      meetings.push({
        title,
        description: `Sign up to take notes for this meeting at https://www.socialjusticesac.org/wix-egusd`,
        start,
        duration,
      })
    })

    return meetings
}

module.exports = scrapeEGUSDBoard