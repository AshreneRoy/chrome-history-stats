import treeify from 'treeify';
import { AppDAO } from './dao/AppDAO.js';
import { KeywordRepository } from './repository/KeywordRepository.js';
import { getHistoryTree } from './historyTree.js';
import * as fileUtils from './utils/file.util.js';

const getSearchSessionsForKeyword = async () => {
  const searchKeyword = process.argv[2];
  const dao = new AppDAO(await fileUtils.copyDBFile());
  const keywordRepository = new KeywordRepository(dao);
  let keyword = await keywordRepository.getAllKeywordAndVisitLikeKeyword(searchKeyword);
  let uniqueVisits = await getHistoryTree();
  await dao.end();
  

  keyword.forEach((element) => {
    element.uniqueVisit = uniqueVisits[element.id]
  })
  return keyword;
  
}

getSearchSessionsForKeyword().then((keyword) => {
  keyword.forEach((element) => {
    console.log("Keyword: "+element.term+"\n"+"=".repeat(100));
    console.log(treeify.asTree(element.uniqueVisit));
  })
});

export { getSearchSessionsForKeyword }