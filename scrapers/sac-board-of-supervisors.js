const cheerio = require("cheerio")
const fetch = require("isomorphic-fetch")

const url = "https://saccounty.mhsoftware.com/rss/calendar_id/3.xml"

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
    // const endDate = $$.find("cdaily\\:eventEndDate").text()
    // const lastModified = $$.find("cdaily\\:lastModified").text()

    const isBoardMeeting = title.toLowerCase().includes("board of supervisors")
    if (!isBoardMeeting) return

    data.push({
      title,
      description,
      link,
      guid,
      date: startDate,
    })
  })

  return data
}

module.exports = scrapeSacBoardOfSupervisors
