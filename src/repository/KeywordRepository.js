export class KeywordRepository {

  constructor(dao) {
    this.dao = dao
  }

  getAllKeywordsAndUrls() {
    return this.dao.all(`select * from keyword_search_terms inner join urls on keyword_search_terms.url_id = urls.id`);
  }
  
  getAllKeywordAndVisitLikeKeyword(keyword) {
    return this.dao.all(`select * from keyword_search_terms inner join visits on keyword_search_terms.url_id = visits.url where term like '%${keyword}%'`);
  }
}