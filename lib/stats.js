import * as dataUtils from './utils/data.util';
import * as dateUtils from './utils/date.util';
import * as fileUtils from './utils/file.util';
import { AppDAO } from './dao/AppDAO';
import { DownloadRepository } from './repository/DownloadRepository';
import { KeywordRepository } from './repository/KeywordRepository';
import { UrlRepository } from './repository/UrlRepository';
import { VisitRepository } from './repository/VisitRepository';

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

  const downloads = await downloadRepository.getAll();
  const urls = await urlRepository.getAll();
  const visits = await visitRepository.getAllVisitLikeUrl(urls[0].url);
  const keywords = await keywordRepository.getAllKeywordsAndUrls();
  const today = dateUtils.formatDateFromUnixTimestamp(new Date());
  const todayStat = await visitRepository.getAllVisitAndUrlGreaterThanVisitTime(
    dateUtils.convertUnixToWekitTimestamp(today),
  );
  await dao.end();

  const cleanTodayStats = todayStat.map((ele) => dataUtils.convertToReadableTime(ele));
  const uniqueKeywords = {};
  keywords.forEach((element) => {
    if (uniqueKeywords[element.term] == null) uniqueKeywords[element.term] = 0;
    uniqueKeywords[element.term] += element.visit_count;
  });

  const totalDownloadsSize = downloads.reduce((acc, currV) => acc + currV.total_bytes, 0);

  const visitsByDay = {};
  visits.forEach((ele) => {
    const a = dataUtils.convertToReadableDate(ele);
    if (visitsByDay[a.visit_time] == null) visitsByDay[a.visit_time] = 0;
    visitsByDay[a.visit_time] = '='.repeat(visitsByDay[a.visit_time].length + 1);
  });

  function sortObject(obj) {
    const arr = [];
    let prop;
    // eslint-disable-next-line no-restricted-syntax
    for (prop in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(prop)) {
        arr.push({
          key: prop,
          value: obj[prop],
        });
      }
    }
    arr.sort((a, b) => b.value - a.value);
    return arr;
  }

  console.log(`\nTop site: ${urls[0].url} activity by day\n`);
  console.log(visitsByDay);
  console.log('\nChrome visits to urls and time spent in each in a day\n');
  console.table(cleanTodayStats.sort((a, b) => b.visit_duration - a.visit_duration).slice(0, 20));
  console.log('\n20 most searched keywords\n');
  console.table(sortObject(uniqueKeywords).slice(0, 20));
  console.log('\n20 most visited sites\n');
  console.table(urls.slice(0, 20));
  console.log('\n10 largest files downloaded\n');
  console.table(downloads.slice(0, 10));
  console.log('\nTotal downloads size\n');
  console.log(dataUtils.convertBytesToNearestMemoryUnit(totalDownloadsSize));
}

main().then(console.log);
