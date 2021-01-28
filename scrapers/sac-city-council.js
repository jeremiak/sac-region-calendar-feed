const cheerio = require("cheerio")
const { timeParse } = require("d3-time-format")
const fetch = require("isomorphic-fetch")

const url =
  "http://sacramento.granicus.com/ViewPublisherRSS.php?view_id=21&mode=agendas"

//Tue, 15 Dec 2020 05:00:00 -0800
const parseDate = timeParse("%a, %e %b %Y %_I:%M:%S -0800")

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
    // not really sure what's going on here, it seems like the council
    // data source is 12 hours off and is throwing all the meetings
    // into the early morning
    const hours = date.getHours() + 12
    const start = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      hours,
      date.getMinutes(),
    ]

    data.push({
      title: title.replace("City Council", "Sacramento City Council"),
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
