import { startDb, end, getVisitData, getKeywordData } from './sqliteConnector.js';
import { massageData } from './massageData.js';
import { copyHistory } from './copyHistory.js';
import treeify from 'treeify';

export async function main(keyWord) {

  let path = await copyHistory();
  let db = await startDb(path);
  let keyword = await getKeywordData(db, keyWord);
  let allVisits = await getVisitData(db);
  await end(db);
  let uniqueVisits = {};

  allVisits.forEach(ele => {
    let element = massageData(ele);
    let node;
    if(uniqueVisits[element.id] == null) {
      node = {
        [element.id]: [],
        [element.url]: ''
      }
      uniqueVisits[element.id] = node;
    }
    if(uniqueVisits[element.fromVisit] == null) {
      node = {
        [element.fromVisit]: [],
        [element.url]: ''
      }
      uniqueVisits[element.fromVisit] = node;
    }
    uniqueVisits[element.fromVisit][element.fromVisit].push(uniqueVisits[element.id]);
    
  });

  keyword.forEach((ele) => {
    console.log("Keyword: "+ele.term+"\n"+"=".repeat(100));
    console.log(treeify.asTree(uniqueVisits[ele.id]));
  })
  
}
main("zeta").then(console.log);