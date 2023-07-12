"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptDownloadDataFile = exports.getDataFileName = void 0;
const qs_js_utils_1 = require("qs-js-utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mkdirp_1 = require("mkdirp");
const axios_1 = __importDefault(require("axios"));
function getDataFileName(channel, exchange, pairDb, startDate) {
    const utcDate = (0, qs_js_utils_1.getDay)(startDate);
    const outputFileName = `${channel}/${exchange}/${pairDb}/${channel}-${exchange}-${pairDb}-${utcDate}.gz`;
    return outputFileName;
}
exports.getDataFileName = getDataFileName;
const DEFAULT_DOWNLOAD_URL = 'http://data.quantsatoshi.com/api/download-data';
function attemptDownloadDataFile({ exchange, pair, startDate, channel, accessKey, dataFolder, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileName = getDataFileName(channel, exchange, pair, startDate);
        const utcDate = (0, qs_js_utils_1.getDay)(startDate);
        const outputFileFullPath = `${dataFolder}/${fileName}`;
        if (fs_1.default.existsSync(outputFileFullPath))
            return fileName;
        console.log(`downloading file ${fileName}`);
        const BASE_DOWNLOAD_URL = process.env.QS_DATA_DOWNLOAD_URL || DEFAULT_DOWNLOAD_URL;
        const url = `${BASE_DOWNLOAD_URL}?channel=${channel}&exchange=${exchange}&pair=${pair}&startDate=${utcDate}&accessKey=${accessKey}`;
        const pathParsed = path_1.default.parse(outputFileFullPath);
        (0, mkdirp_1.mkdirp)(pathParsed.dir);
        try {
            const response = yield (0, axios_1.default)({
                url,
                method: 'GET',
                responseType: 'stream',
                timeout: 300000,
            });
            const writer = fs_1.default.createWriteStream(outputFileFullPath);
            return new Promise((resolve, reject) => {
                response.data.pipe(writer);
                let error = null;
                writer.on('error', (err) => {
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
        }
        catch (e) {
            if (e && e.response) {
                console.error(`download file failed ${fileName} code=`, e.response.status);
            }
            else {
                console.error(`download file failed ${fileName}`, e);
            }
            return null;
        }
    });
}
exports.attemptDownloadDataFile = attemptDownloadDataFile;
