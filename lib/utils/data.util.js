import * as constants from '../constants/app.constants.js';
import * as dateUtils from './date.util.js';

const convertToReadableTime = (row) => ({
  url: row.url,
  visit_time: dateUtils.convertWebkitToUnixTimestamp(row.visit_time).toDateString(),
  visit_duration: Math.round(row.visit_duration / (60 * 1000000)),
});

const convertToReadableDate = (row) => ({
  url: row.url,
  visit_time: dateUtils.convertWebkitToUnixTimestamp(row.visit_time).toDateString(),
});

const convertBytesToNearestMemoryUnit = (bytes) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / 1024 ** i).toFixed(2))} ${constants.MEMORY_SIZES[i]}`;
};

const massageData = (row) => ({
  id: row.id,
  url: row.url,
  fromVisit: row.from_visit,
});

export {
  convertToReadableTime, convertToReadableDate, convertBytesToNearestMemoryUnit, massageData,
};
