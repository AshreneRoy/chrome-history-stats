import { startDb, end, getDownloadsData } from './sqliteConnector.js';
import { copyHistory } from './copyHistory.js';

export async function main() {

  let path = await copyHistory();
  let db = await startDb(path);
  let downloads = await getDownloadsData(db);
  await end(db);
  return downloads;
}
main().then(console.table);