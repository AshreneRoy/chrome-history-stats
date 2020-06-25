import * as fileUtils from './utils/file.util';
import { AppDAO } from './dao/AppDAO';
import { DownloadRepository } from './repository/DownloadRepository';

const getAllDownloads = async () => {
  const dao = new AppDAO(await fileUtils.copyDBFile());
  const downloadRepository = new DownloadRepository(dao);
  const downloads = await downloadRepository.getAll();
  await dao.end();
  return downloads;
};

getAllDownloads().then(console.table);

export { getAllDownloads };
