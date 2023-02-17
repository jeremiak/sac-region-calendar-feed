# Sacramento region calendar scraper

Scrape calendars from [regional governmental bodies](https://github.com/jeremiak/sac-region-calendar-feed/issues/1) and generate a single `.ics` feed from them. We can easily add that `.ics` feed to a Google calendar (or other calendar software) for easy monitoring.

## Getting started

0. `npm install`
1. `npm run dev`
2. You can check out the `.ics` file at [http://localhost:3000/calendar.ics](http://localhost:3000/calendar.ics)

## Scrapers

Each "scraper" is represented within the `scrapers/` directory as a single file. It is expected that each file exports a function that returns a promise. That promise should fulfill with an array of objects, each representing a calendar event and structured as follows:

```
{
  title: 'Meeting title goes here',
  description: 'Meeting description goes here',
  url: 'Any sort of URL for the meeting goes here',
  uid: 'Use any sort of internal identifier that the source uses',
  start: [YYYY, MM, DD, H, M],
  duration: { hours: 2, minutes: 0 },
}
```
Please make sure to adjust the `duration.hours` and `duration.minutes` values if applicable to the meeting.
