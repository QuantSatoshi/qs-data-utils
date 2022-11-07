"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candleV2ToCandleDb = exports.candleToCandleV2 = void 0;
function candleToCandleV2(candle) {
    const ts = (() => {
        if (candle.date)
            return candle.date.getTime();
        if (candle.ts)
            return candle.ts; // candle keeper format
        throw new Error(`no ts for candle ${JSON.stringify(candle)}`);
    })();
    return [
        ts,
        candle.first,
        candle.max,
        candle.min,
        candle.last,
        candle.buy_volume,
        candle.sell_volume,
        candle.buy_cost,
        candle.sell_cost,
    ];
}
exports.candleToCandleV2 = candleToCandleV2;
function candleV2ToCandleDb(candleV2) {
    return {
        date: new Date(candleV2[0]),
        first: candleV2[1],
        max: candleV2[2],
        min: candleV2[3],
        last: candleV2[4],
        buy_volume: candleV2[5],
        sell_volume: candleV2[6],
        buy_cost: candleV2[7],
        sell_cost: candleV2[8],
    };
}
exports.candleV2ToCandleDb = candleV2ToCandleDb;
