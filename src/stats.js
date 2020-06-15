import { startDb, end, getDownloadsData, getKeywordsData, getVisitData } from './sqliteConnector.js';
import { copyHistory } from './copyHistory.js';
import treeify from 'treeify';

export async function main() {

  // some stats ideas for nerds:
  // [] 10 most searched keywords
  // [] 10 most visited sites
  // [] chrome visits per day (all time)
  // [] chrome visits to urls and time spent in each in a day
  // [*] 10 largest files downloaded
  // [*] total downloads size

  let path = await copyHistory();
  let db = await startDb(path);
  let downloads = await getDownloadsData(db);
  let visits = await getVisitData(db);
  let keywords = await getKeywordsData(db);
  await end(db);

  let result = [];
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  let totalDownloadsSize = downloads.reduce((acc, currV) => {
    return acc + currV.total_bytes;
  }, 0);
  const i = Math.floor(Math.log(totalDownloadsSize) / Math.log(1024));
  
  result.push("10 largest files downloaded\n")
  result.push(treeify.asTree(downloads.slice(0,10),true));
  result.push("Total downloads size\n")
  result.push(parseFloat((totalDownloadsSize / Math.pow(1024, i))).toFixed(2)+ ' ' + sizes[i]);
  return result.join('\n');
  
}

main().then(console.log);