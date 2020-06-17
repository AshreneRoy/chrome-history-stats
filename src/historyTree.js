import treeify from 'treeify';
import { AppDAO } from './dao/AppDAO.js';
import { VisitRepository } from './repository/VisitRepository.js';
import * as fileUtils from './utils/file.util.js';
import * as dataUtils from './utils/data.util.js';

const getHistoryTree = async () => {

  const dao = new AppDAO(await fileUtils.copyDBFile());
  const visitRepository = new VisitRepository(dao);
  let allVisits = await visitRepository.getAllVisitAndUrl();
  await dao.end();
  let uniqueVisits = {};

  allVisits.forEach(ele => {
    let element = dataUtils.massageData(ele);
    if(uniqueVisits[element.id] == null) {
      uniqueVisits[element.id] = {
        [element.id]: [],
        [element.url]: ''
      };
    }
    if(uniqueVisits[element.fromVisit] == null) {
      uniqueVisits[element.fromVisit] = {
        [element.fromVisit]: [],
        [element.url]: ''
      }
    }
    uniqueVisits[element.fromVisit][element.fromVisit].push(uniqueVisits[element.id]);
    
  });
  return uniqueVisits;
}

getHistoryTree().then((result) => console.log(treeify.asTree(result[0])));

export { getHistoryTree }