"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniswapV3ArrToJson = exports.uniswapV3RawToJson = exports.uniswapV3JsonToArr = void 0;
function uniswapV3JsonToArr(results) {
    return results.map((r) => [
        r.ts,
        r.high,
        r.low,
        r.close,
        r.feeToken0,
        r.feeToken1,
        r.tokens[0],
        r.tokens[1],
        r.feeV,
        r.feeUnb,
        r.amountV,
        r.amountTR,
        r.feeUSD,
        r.baseClose,
    ]);
}
exports.uniswapV3JsonToArr = uniswapV3JsonToArr;
function uniswapV3RawToJson(r) {
    return {
        ts: r[0],
        high: r[1],
        low: r[2],
        close: r[3],
        feeToken0: r[4],
        feeToken1: r[5],
        tokens: [r[6], r[7]],
        feeV: r[8],
        feeUnb: r[9],
        amountV: r[10],
        amountTR: r[11],
        feeUSD: r[12],
        baseClose: r[13],
    };
}
exports.uniswapV3RawToJson = uniswapV3RawToJson;
function uniswapV3ArrToJson(arr) {
    return arr.map(uniswapV3RawToJson);
}
exports.uniswapV3ArrToJson = uniswapV3ArrToJson;
