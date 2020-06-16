function massageData(row) {
  return {
    id: row.id,
    url: row.url,
    fromVisit: row.from_visit
  }
}

function convertToReadableTime(row) {
  return {
    url: row.url,
    visit_time: convertWebkitTimeToUnix(row.visit_time),
    visit_duration: Math.round(row.visit_duration/60000000)
  }
}

function convertToReadableDate(row) {
  return {
    url: row.url,
    visit_time: (convertWebkitTimeToUnix(row.visit_time).toString().split("T"))[0]
  }
}

function convertWebkitTimeToUnix(webKitTime) {
  let time =  new Date(((webKitTime/1000)+new Date('1601-01-01').getTime()));
  let dd = String(time.getDate()).padStart(2, '0');
  let mm = String(time.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = time.getFullYear();
  return mm + '-' + dd + '-' + yyyy;
}

export { massageData, convertToReadableTime, convertToReadableDate };