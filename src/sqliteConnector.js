import sqlite3 from 'sqlite3';

function startDb() {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database('/Users/Ashrene_Roy/Documents/chrome-history-tree/History', sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        reject(err.message);
      }
      console.log('Connection opened');
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
    db.all(`select id,url,from_visit from visits`, (err, rows) => {
      if (err) {
        reject(err.message);
      }
      resolve(rows);
    });
  });
}


export { startDb, end, getVisitData };
