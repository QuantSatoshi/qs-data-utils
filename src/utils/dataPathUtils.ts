import { getDay } from 'qs-js-utils';
import fs from 'fs';
import path from 'path';
import { mkdirp } from 'mkdirp';
import axios from 'axios';

export function getDataFileName(channel: string, exchange: string, pairDb: string, startDate: string | Date | number) {
  const utcDate = getDay(startDate);
  const outputFileName = `${channel}/${exchange}/${pairDb}/${channel}-${exchange}-${pairDb}-${utcDate}.gz`;
  return outputFileName;
}

const DEFAULT_DOWNLOAD_URL = 'http://data.quantsatoshi.com/api/download-data';

export async function attemptDownloadDataFile({
  exchange,
  pair,
  startDate,
  channel,
  accessKey,
  dataFolder,
}: {
  exchange: string;
  pair: string;
  startDate: string | Date;
  channel: string;
  accessKey: string;
  dataFolder: string;
}): Promise<string | null> {
  const fileName = getDataFileName(channel, exchange, pair, startDate);
  const utcDate = getDay(startDate);
  const outputFileFullPath = `${dataFolder}/${fileName}`;
  if (fs.existsSync(outputFileFullPath)) return fileName;
  console.log(`downloading file ${fileName}`);
  const BASE_DOWNLOAD_URL = process.env.QS_DATA_DOWNLOAD_URL || DEFAULT_DOWNLOAD_URL;
  const url = `${BASE_DOWNLOAD_URL}?channel=${channel}&exchange=${exchange}&pair=${pair}&startDate=${utcDate}&accessKey=${accessKey}`;
  const pathParsed = path.parse(outputFileFullPath);
  mkdirp(pathParsed.dir);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 600000,
    });
    const writer = fs.createWriteStream(outputFileFullPath);
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error: any = null;
      writer.on('error', (err: any) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          console.log(`download complete`, outputFileFullPath);
          resolve(fileName);
        }
      });
    });
  } catch (e) {
    if (e && (e as any).response) {
      console.error(`download file failed ${fileName} code=`, (e as any).response.status);
    } else {
      console.error(`download file failed ${fileName}`, e);
    }
    return null;
  }
}
