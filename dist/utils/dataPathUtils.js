"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFileName = void 0;
const qs_js_utils_1 = require("qs-js-utils");
function getDataFileName(channel, exchange, pairDb, startDate) {
    const utcDate = (0, qs_js_utils_1.getDay)(startDate);
    const outputFileName = `${channel}/${exchange}/${pairDb}/${channel}-${exchange}-${pairDb}-${utcDate}.gz`;
    return outputFileName;
}
exports.getDataFileName = getDataFileName;
