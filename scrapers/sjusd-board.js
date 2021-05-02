const cheerio = require("cheerio")
const { timeParse } = require("d3-time-format")
const fetch = require("isomorphic-fetch")

const url = 'https://www.sanjuan.edu/Page/350'
const parseDate = timeParse('%B %e, %Y')

async function scrapeSJUSDBoard() {
    const req = await fetch(url)
    const text = await req.text()
    const $ = cheerio.load(text)
    const h3 = $('.ui-article h3')
    const ul = h3.next('div')
    const lis = ul.find('div')
    const meetings = []

    lis.each(function() {
        const text = $(this).text().split(' (')[0]
        const parsedDate = parseDate(text)
        const title = 'San Juan USD Board Meeting'
        const start = [
            parsedDate.getFullYear(),
            parsedDate.getMonth() + 1,
            parsedDate.getDate(),
            18,
            30,
        ]
        const duration = {
            hours: 2,
        }

        meetings.push({
          title,
          description: `Sign up to take notes for this meeting at https://bit.ly/3vz4gJW`,
          url: "https://www.sanjuan.edu/site/Default.aspx?PageID=49724",
          start,
          duration,
        })
    })

    return meetings
}

module.exports = scrapeSJUSDBoard