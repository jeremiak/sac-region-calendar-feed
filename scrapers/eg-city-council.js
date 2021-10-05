const cheerio = require("cheerio")
const { timeParse } = require("d3-time-format")
const fetch = require("isomorphic-fetch")

const url = 'http://www.elkgrovecity.org/syndication/rss.aspx?serverid=109585&userid=5&feed=portalcalendarevents&key=Mp7J5Nng6eyRpRFEANYMlipBtj0HmTHDa9udgeP9IkCO1yAsYld2NIbu1Jos26g6RZ%2f4xASB27e3ugp2HeFtQw%3d%3d&portal_id=109669&page_id=109685&calendar_context_id=124124&portlet_instance_id=11277&calendar_id=124125&v=2.0'

//Tue, 15 Dec 2020 05:00:00 -0800
const parseDate = timeParse("%a, %e %b %Y %I:%M:%S GMT")

async function scrapeEGCityCouncil() {
  const req = await fetch(url)
  const text = await req.text()
  const $ = cheerio.load(text, { xmlMode: true })
  const items = $("item")

  const data = []
  items.each(function () {
    const $$ = $(this)

    const title = $$.find("title").text()
    const description = $$.find("description").text()
    const url = $$.find("link").text()
    const startDate = $$.find("pubDate").text()

    const isCityCouncilMeeting = title.toLowerCase().includes("city council")
    if (!isCityCouncilMeeting) return

    const date = parseDate(startDate)
    const start = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      18,
      date.getMinutes(),
    ]

    data.push({
      title: title.replace(
        "City Council Meeting",
        "Elk Grove City Council Meeting"
      ),
      description: `Sign up to take notes for this meeting at https://www.socialjusticesac.org/wix-eg-city-council`,
      url,
      start,
      duration: { hours: 4 },
    })
  })

  return data
}

module.exports = scrapeEGCityCouncil
