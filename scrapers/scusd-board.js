const { timeFormat, timeParse } = require("d3-time-format")
const cheerio = require("cheerio")
const fetch = require("isomorphic-fetch")

const url = "https://www.scusd.edu/calendar"

const parseDate = timeParse("%B %e, %Y")
const parseTime = timeParse("%_I:%M%p")

//"Tue, 08 Dec 2020 02:15:00 -0800",
const formatDate = timeFormat("%a, %d %b %Y %I:%M:%S %Z")

async function scrapeSCUSDBoard() {
  const req = await fetch(url)
  const text = await req.text()
  const $ = cheerio.load(text)
  const items = $('a[title^="Board"]')

  const data = []
  items.each(function (index, item) {
    const $$ = $(this)

    const title = $$.find("h2").text()
    const date = $$.find("time").text()
    const startTime = $$.find(".date-display-single").text()
    const parsedDate = parseDate(date)
    const parsedTime = parseTime(startTime)

    const isBOEMeeting = title.toLowerCase().includes("board of education")
    if (!isBOEMeeting) return

    parsedDate.setHours(parsedTime.getHours())
    parsedDate.setMinutes(parsedTime.getMinutes())

    const start = [
      parsedDate.getFullYear(),
      parsedDate.getMonth() + 1,
      parsedDate.getDate(),
      parsedDate.getHours(),
      parsedDate.getMinutes(),
    ]

    data.push({
      title: "SCUSD Board Meeting",
      start,
      description: `Sign up to take notes for this meeting at https://bit.ly/3ubwNoF`,
      duration: { hours: 2 },
    })
  })

  return data
}

module.exports = scrapeSCUSDBoard
