import { startDb, end, getVisitData } from './sqliteConnector.js';
import { massageData } from './massageData.js';
import { copyHistory } from './copyHistory.js';
import treeify from 'treeify';

export async function main() {

  let path = await copyHistory();
  let db = await startDb(path);
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
  return treeify.asTree(uniqueVisits[0]);
}
main().then(console.log);