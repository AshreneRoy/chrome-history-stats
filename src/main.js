import { TreeNode } from './tree.js';
import { sampleAllVisits } from './sampleAllVisits.js';

export function main() {
  // assuming an array of objects of type:
  // [{id:1,url:123,from_visit:345},{},{}...]
  let allVisits = sampleAllVisits;
  let uniqueVisits = {};

  allVisits.forEach(element => {
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

console.log(main());