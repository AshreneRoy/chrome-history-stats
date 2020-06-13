import sqlite3 from 'sqlite3';

// open the database
function getVisitData() {
  let db = new sqlite3.Database('/Users/Ashrene_Roy/Documents/chrome-history-tree/History', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chrome history database.');
  });

  let result = [];
  db.serialize(() => {
    db.each(`select id,url,from_visit from visits`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      result.push(row);
    });
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
  return result;
}

export { getVisitData };