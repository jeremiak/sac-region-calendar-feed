# Sacramento region calendar scraper

Scrape calendars from regional governmental bodies and generate a single `.ics` feed from them.

## Getting started

0. `npm install`
1. `npm start`
2. You can check out the `.ics` file at [http://localhost:3000/calendar.ics](http://localhost:3000/calendar.ics)

## Scrapers

Each "scraper" is represented within the `scrapers/` directory as a single file. It is expected that each file exports a function that returns a promise. That promise should fulfill with all of the calendar events structured as follows:

```
{
  title: 'Meeting title goes here',
  description: 'Meeting description goes here',
  url: 'Any sort of URL for the meeting goes here',
  uid: 'Use any sort of internal identifier that the source uses',
  start: [YYYY, MM, DD, H, M],
  duration: { minutes: 90 },
}
```
