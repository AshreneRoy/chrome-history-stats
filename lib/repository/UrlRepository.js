export class UrlRepository {

  constructor(dao) {
    this.dao = dao
  }

  getAll() {
    return this.dao.all(`select url, visit_count from urls order by visit_count desc`);
  }

}