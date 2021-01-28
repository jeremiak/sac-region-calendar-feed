// i can't find a public feed of the meetings, scheduled in advance
// so i'm just copying the data from the calendar posted at
// https://www.cityofsacramento.org/-/media/Corporate/Files/City-Clerk/City-Council-Meetings/1-2021-City-Council-Meeting-Calendar-FINAL-Adopted-12012020.pdf?la=en
const { timeParse } = require("d3-time-format")

const meetings = [
  "01/05/2021 5:00 PM",
  "01/12/2021 2:00 PM",
  "01/19/2021 2:00 PM",
  "01/19/2021 5:00 PM",
  "01/26/2021 5:00 PM",
  "02/02/2021 5:00 PM",
  "02/09/2021 2:00 PM",
  "02/16/2021 5:00 PM",
  "03/02/2021 5:00 PM",
  "03/09/2021 2:00 PM",
  "03/16/2021 2:00 PM",
  "03/16/2021 5:00 PM",
  "04/06/2021 5:00 PM",
  "04/13/2021 2:00 PM",
  "04/20/2021 2:00 PM",
  "04/20/2021 5:00 PM",
  "05/04/2021 5:00 PM",
  "05/18/2021 2:00 PM",
  "05/18/2021 5:00 PM",
  "05/25/2021 2:00 PM",
  "05/25/2021 5:00 PM",
  "06/01/2021 5:00 PM",
  "06/08/2021 2:00 PM",
  "06/15/2021 2:00 PM",
  "06/15/2021 5:00 PM",
  "06/29/2021 2:00 PM",
  "07/20/2021 2:00 PM",
  "07/27/2021 5:00 PM",
  "08/10/2021 2:00 PM",
  "08/17/2021 2:00 PM",
  "08/17/2021 5:00 PM",
  "08/24/2021 5:00 PM",
  "09/14/2021 2:00 PM",
  "09/21/2021 2:00 PM",
  "09/21/2021 5:00 PM",
  "10/12/2021 2:00 PM",
  "10/19/2021 2:00 PM",
  "10/19/2021 5:00 PM",
  "10/26/2021 2:00 PM",
  "10/26/2021 5:00 PM",
  "11/09/2021 2:00 PM",
  "11/16/2021 2:00 PM",
  "11/16/2021 5:00 PM",
  "11/30/2021 5:00 PM",
  "12/07/2021 2:00 PM",
  "12/07/2021 5:00 PM",
  "12/14/2021 2:00 PM",
]

const parseTime = timeParse("%m/%d/%Y %_I:%M %p")

async function scrapeSacCityCouncil() {
  return meetings.map(function (meeting) {
    const date = parseTime(meeting)
    const start = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ]
    return {
      title: "Sacramento City Council",
      description: "",
      url: "",
      start,
      duration: { hours: 2 },
    }
  })
}

module.exports = scrapeSacCityCouncil
