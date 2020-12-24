const cheerio = require("cheerio")
const fetch = require("isomorphic-fetch")

const url =
  "http://sacramento.granicus.com/ViewPublisherRSS.php?view_id=21&mode=agendas"

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

    data.push({
      title,
      description,
      link,
      guid,
      date: startDate,
    })
  })

  return data

  debugger
}

module.exports = scrapeSacCityCouncil
