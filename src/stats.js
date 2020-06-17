import { AppDAO } from './dao/AppDAO.js';
import { KeywordRepository } from './repository/KeywordRepository.js';
import { VisitRepository } from './repository/VisitRepository.js';
import { DownloadRepository } from './repository/DownloadRepository.js';
import { UrlRepository } from './repository/UrlRepository.js';
import * as dateUtils from './utils/date.util.js';
import * as dataUtils from './utils/data.util.js';
import * as fileUtils from './utils/file.util.js';

export async function main() {

  // some stats ideas for nerds:
  // [*] 20 most searched keywords
  // [*] 20 most visited sites
  // [*] 20 chrome visits to urls and time spent in each in a day
  // [*] Top site activity by day
  // [*] 10 largest files downloaded
  // [*] total downloads size
  // [*] Keyword search session

  const dao = new AppDAO(await fileUtils.copyDBFile());
  const keywordRepository = new KeywordRepository(dao);
  const downloadRepository = new DownloadRepository(dao);
  const visitRepository = new VisitRepository(dao);
  const urlRepository = new UrlRepository(dao);

  let downloads = await downloadRepository.getAll();
  let urls = await urlRepository.getAll();
  let visits = await visitRepository.getAllVisitLikeUrl(urls[0].url);
  let keywords = await keywordRepository.getAllKeywordsAndUrls();
  let today = dateUtils.formatDateFromUnixTimestamp(new Date());
  let todayStat = await visitRepository.getAllVisitAndUrlGreaterThanVisitTime(
      dateUtils.convertUnixToWekitTimestamp(today)
    );
  await dao.end();

  let cleanTodayStats = todayStat.map((ele) => dataUtils.convertToReadableTime(ele));
  let uniqueKeywords = {};
  keywords.forEach(element => {
    if(uniqueKeywords[element.term] == null)
      uniqueKeywords[element.term] = 0;
    uniqueKeywords[element.term] = uniqueKeywords[element.term] + element.visit_count;
  });
  

  let totalDownloadsSize = downloads.reduce((acc, currV) => {
    return acc + currV.total_bytes;
  }, 0);
  

  let visitsByDay = {};
  visits.forEach((ele) => {
    let a = dataUtils.convertToReadableDate(ele);
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
  console.log(dataUtils.convertBytesToNearestMemoryUnit(totalDownloadsSize));

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