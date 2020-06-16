import { startDb, end, getDownloadsData, getKeywordsData, getVisitDataForUrl, getUrlData, getStatForToday } from './sqliteConnector.js';
import { copyHistory } from './copyHistory.js';
import { convertToReadableTime, convertToReadableDate } from './massageData.js';

export async function main() {

  // some stats ideas for nerds:
  // [*] 20 most searched keywords
  // [*] 20 most visited sites
  // [*] 20 chrome visits to urls and time spent in each in a day
  // [*] Top site activity by day
  // [*] 10 largest files downloaded
  // [*] total downloads size
  // [*] Keyword search session

  let path = await copyHistory();
  let db = await startDb(path);
  let downloads = await getDownloadsData(db);
  let urls = await getUrlData(db);
  let visits = await getVisitDataForUrl(db, urls[0].url);

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = mm + '-' + dd + '-' + yyyy;
  let todayStat = await getStatForToday(db, (new Date('1601-01-01').getTime()*(-1)+new Date(today).getTime())*1000)
  let keywords = await getKeywordsData(db);
  await end(db);
  let cleanTodayStats = todayStat.map((ele) => convertToReadableTime(ele));
  let uniqueKeywords = {};
  keywords.forEach(element => {
    if(uniqueKeywords[element.term] == null)
      uniqueKeywords[element.term] = 0;
    uniqueKeywords[element.term] = uniqueKeywords[element.term] + element.visit_count;
  });
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  let totalDownloadsSize = downloads.reduce((acc, currV) => {
    return acc + currV.total_bytes;
  }, 0);
  const i = Math.floor(Math.log(totalDownloadsSize) / Math.log(1024));

  let visitsByDay = {};
  visits.forEach((ele) => {
    let a = convertToReadableDate(ele);
    if (visitsByDay[a.visit_time] == null)
      visitsByDay[a.visit_time] = 0;
    visitsByDay[a.visit_time] = "=".repeat(visitsByDay[a.visit_time].length+1);
  });

  console.log("\nTop site: " + urls[0].url + " activity by day\n");
  console.log(visitsByDay);
  console.log("\nChrome visits to urls and time spent in each in a day\n");
  console.table(cleanTodayStats.sort((a,b) => {
    return b.visit_duration - a.visit_duration;
  }).slice(0,20));
  console.log("\n20 most searched keywords\n");
  console.table(sortObject(uniqueKeywords).slice(0,20));
  console.log("\n20 most visited sites\n")
  console.table(urls.slice(0,20));
  console.log("\n10 largest files downloaded\n")
  console.table(downloads.slice(0,10));
  console.log("\nTotal downloads size\n")
  console.log(parseFloat((totalDownloadsSize / Math.pow(1024, i))).toFixed(2)+ ' ' + sizes[i]);

}

function sortObject(obj) {
  var arr = [];
  var prop;
  for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
          arr.push({
              'key': prop,
              'value': obj[prop]
          });
      }
  }
  arr.sort(function(a, b) {
      return b.value - a.value;
  });
  return arr;
}


main().then(console.log);