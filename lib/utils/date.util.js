import * as constants from '../constants/app.constants.js';

const convertWebkitToUnixTimestamp = (webKitTime) => new Date(((webKitTime / 1000)
+ new Date(constants.WEBKIT_START_DATE).getTime()));

const convertUnixToWekitTimestamp = (unixTime) => (
  new Date(constants.WEBKIT_START_DATE).getTime() * (-1) + new Date(unixTime).getTime()) * 1000;

const formatDateFromUnixTimestamp = (unixTime) => {
  const dd = String(unixTime.getDate()).padStart(2, '0');
  const mm = String(unixTime.getMonth() + 1).padStart(2, '0');
  const yyyy = unixTime.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
};

export { convertWebkitToUnixTimestamp, formatDateFromUnixTimestamp, convertUnixToWekitTimestamp };
