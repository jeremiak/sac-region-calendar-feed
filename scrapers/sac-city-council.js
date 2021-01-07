const cheerio = require("cheerio")
const { timeParse } = require("d3-time-format")
const fetch = require("isomorphic-fetch")

const url =
  "http://sacramento.granicus.com/ViewPublisherRSS.php?view_id=21&mode=agendas"

//Tue, 15 Dec 2020 05:00:00 -0800
const parseDate = timeParse("%a, %e %b %Y %_I:%M:%S %Z")

async function scrapeSacCityCouncil() {
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
    const startDate = $$.find("pubDate").text()

    const isCityCouncilMeeting = title.toLowerCase().includes("city council")
    if (!isCityCouncilMeeting) return

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
      duration: { hours: 2 },
    })
  })

  return data
}

module.exports = scrapeSacCityCouncil
