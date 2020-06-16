import sqlite3 from 'sqlite3';

function startDb(path) {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(path, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        reject(err.message);
      }
      resolve(db);
    });
  });
}

function end(db) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err.message);
      }
      resolve('Close the database connection.');
    });
  });
}

function getVisitData(db) {
  return new Promise((resolve, reject) => {
    db.all(`select visits.id,urls.url,visits.from_visit,visit_time, visit_duration, visit_count from visits inner join urls on visits.url = urls.id;`, (err, rows) => {
      if (err) {
        reject(err.message);
      }
      resolve(rows);
    });
  });
}

function getVisitDataForUrl(db, url) {
  return new Promise((resolve, reject) => {
    db.all(`select visits.id,urls.url,visits.from_visit,visit_time, visit_duration, visit_count from visits inner join urls on visits.url = urls.id where urls.url like '%`+url+`%';`, (err, rows) => {
      if (err) {
        reject(err.message);
      }
      resolve(rows);
    });
  });
}

function getUrlData(db) {
  return new Promise((resolve, reject) => {
    db.all(`select url, visit_count from urls order by visit_count desc;`, (err, rows) => {
      if (err) {
        reject(err.message);
      }
      resolve(rows);
    });
  });
}

function getDownloadsData(db) {
  return new Promise((resolve, reject) => {
    db.all(`select current_path, total_bytes, tab_url from downloads order by total_bytes desc;`, (err, rows) => {
      if (err) {
        reject(err.message);
      }
      resolve(rows);
    });
  });
}
function getKeywordsData(db) {
  return new Promise((resolve, reject) => {
    db.all(`select * from keyword_search_terms inner join urls on keyword_search_terms.url_id = urls.id;`, (err, rows) => {
      if (err) {
        reject(err.message);
      }
      resolve(rows);
    });
  });
}

function getKeywordData(db, keyword) {
  return new Promise((resolve, reject) => {
    db.all(`select * from keyword_search_terms inner join visits on keyword_search_terms.url_id = visits.url where term like '%`+keyword+`%';`, (err, rows) => {
      if (err) {
        reject(err.message);
      }
      resolve(rows);
    });
  });
}

function getStatForToday(db, time) {
  return new Promise((resolve, reject) => {
    db.all(`select urls.url,visit_time, visit_duration from visits inner join urls on visits.url = urls.id where visit_time >= ` + time, (err, rows) => {
      if (err) {
        reject(err.message);
      }
      resolve(rows);
    });
  });
}


export { startDb, end, getVisitData, getDownloadsData, getKeywordsData, getKeywordData, getUrlData, getStatForToday, getVisitDataForUrl };
