export class VisitRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAllVisitAndUrlGreaterThanVisitTime(time) {
    return this.dao.all(`select urls.url,visit_time, visit_duration from visits inner join urls on visits.url = urls.id where visit_time >= ${time}`);
  }

  getAllVisitAndUrl() {
    return this.dao.all('select visits.id,urls.url,visits.from_visit,visit_time, visit_duration, visit_count from visits inner join urls on visits.url = urls.id');
  }

  getAllVisitLikeUrl(url) {
    return this.dao.all(`select visits.id,urls.url,visits.from_visit,visit_time, visit_duration, visit_count from visits inner join urls on visits.url = urls.id where urls.url like '%${url}%'`);
  }
}
