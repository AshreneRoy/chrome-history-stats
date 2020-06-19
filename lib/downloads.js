import { AppDAO } from './dao/AppDAO.js';
import { DownloadRepository } from './repository/DownloadRepository.js';
import * as fileUtils from './utils/file.util.js';

const getAllDownloads =  async () => {
  const dao = new AppDAO(await fileUtils.copyDBFile());
  const downloadRepository = new DownloadRepository(dao);
  let downloads = await downloadRepository.getAll();
  await dao.end();
  return downloads;
}

getAllDownloads().then(console.table);

export { getAllDownloads };