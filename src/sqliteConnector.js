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


export { startDb, end, getVisitData, getDownloadsData, getKeywordsData, getUrlData };
