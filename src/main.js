import { TreeNode } from './tree.js';
import { startDb, end, getVisitData } from './sqliteConnector.js';
import { massageData } from './massageData.js';

export async function main() {
  // assuming an array of objects of type:
  // [{id:1,url:123,from_visit:345},{},{}...]
  let db = await startDb();
  let allVisits = await getVisitData(db);
  await end(db);
  let uniqueVisits = {};

  allVisits.forEach(ele => {
    let element = massageData(ele);
    let node;
    if(uniqueVisits[element.id] == null) {
      node = new TreeNode(element.id);
      uniqueVisits[element.id] = node;
    }
    if(uniqueVisits[element.fromVisit] == null) {
      node = new TreeNode(element.fromVisit);
      uniqueVisits[element.fromVisit] = node;
    }
    uniqueVisits[element.fromVisit].descendants.push(uniqueVisits[element.id]);
    
  });
  return uniqueVisits;
}

console.log(main().then(console.log));