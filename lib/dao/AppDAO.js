import sqlite3 from 'sqlite3';

export class AppDAO {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.log(err.message);
      }
    });
  }

  end() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err.message);
        }
        resolve('Close the database connection.');
      });
    });
  }

  all(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err.message);
        }
        resolve(rows);
      });
    });
  }
}
