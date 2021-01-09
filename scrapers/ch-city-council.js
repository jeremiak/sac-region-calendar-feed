
const cheerio = require("cheerio")
const { timeParse } = require("d3-time-format")
const fetch = require("isomorphic-fetch")

const url = 'https://www.citrusheights.net/RSSFeed.aspx?ModID=65&CID=Citrus-Heights-City-Council-Meetings-1'

//Tue, 15 Dec 2020 05:00:00 -0800
const parseDate = timeParse("%B %d, %Y City Council Meeting")

async function scrapeCHCityCouncil() {
  const req = await fetch(url)
  const text = await req.text()
  const $ = cheerio.load(text, { xmlMode: true })
  const items = $("item")

  const data = []
  items.each(function () {
    const $$ = $(this)

    const title = $$.find("title").text().trim()
    const description = $$.find("description").text()
    const uid = $$.find("guid").text()
    const url = $$.find("link").text()

    const date = parseDate(title)
    const start = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      19,
      date.getMinutes(),
    ]

    data.push({
      title: 'Citrus Heights City Council Meeting',
      description,
      uid,
      url,
      start,
      duration: { hours: 2 },
    })
  })

  return data
}

module.exports = scrapeCHCityCouncil
