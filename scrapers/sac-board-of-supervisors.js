const cheerio = require("cheerio")
const { timeParse } = require("d3-time-format")
const fetch = require("isomorphic-fetch")

const url = "https://saccounty.mhsoftware.com/rss/calendar_id/3.xml"

const parseDate = timeParse("%a, %e %b %Y %_I:%M:%S %Z")

async function scrapeSacBoardOfSupervisors() {
  const req = await fetch(url)
  const text = await req.text()
  const $ = cheerio.load(text, { xmlMode: true })

  const items = $("item")

  const data = []
  items.each(function (index, item) {
    const $$ = $(this)

    const title = $$.find("title").text()
    const description = $$.find("description").text()
    const link = $$.find("link").text()
    const guid = $$.find("guid").text()
    const startDate = $$.find("cdaily\\:eventStartDate").text()

    const isBoardMeeting = title.toLowerCase().includes("board of supervisors")
    if (!isBoardMeeting) return

    const date = parseDate(startDate)
    const start = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ]

    data.push({
      title,
      description,
      url: link,
      uid: guid,
      start,
      duration: { minutes: 90 },
    })
  })

  return data
}

module.exports = scrapeSacBoardOfSupervisors
