export class DownloadRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll() {
    return this.dao.all('select current_path, total_bytes, tab_url from downloads order by total_bytes desc');
  }
}
