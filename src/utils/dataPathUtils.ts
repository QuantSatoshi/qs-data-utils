import { getDay } from 'qs-js-utils';

export function getDataFileName(channel: string, exchange: string, pairDb: string, startDate: string | Date | number) {
  const utcDate = getDay(startDate);
  const outputFileName = `${channel}/${exchange}/${channel}-${exchange}-${pairDb}-${utcDate}.gz`;
  return outputFileName;
}
