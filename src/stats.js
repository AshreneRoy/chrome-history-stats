import { startDb, end, getDownloadsData, getKeywordsData, getVisitData, getUrlData } from './sqliteConnector.js';
import { copyHistory } from './copyHistory.js';
import treeify from 'treeify';

export async function main() {

  // some stats ideas for nerds:
  // [*] 20 most searched keywords
  // [*] 20 most visited sites
  // [] chrome visits per day (all time)
  // [] chrome visits to urls and time spent in each in a day
  // [*] 10 largest files downloaded
  // [*] total downloads size

  let path = await copyHistory();
  let db = await startDb(path);
  let downloads = await getDownloadsData(db);
  let visits = await getVisitData(db);
  let urls = await getUrlData(db);
  let keywords = await getKeywordsData(db);
  await end(db);

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