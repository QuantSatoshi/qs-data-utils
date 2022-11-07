"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandleBuilder = void 0;
const tfUtils_1 = require("../utils/tfUtils");
const generateDefaultCandle = (startTs) => ({
    // use closing date for candle
    date: new Date(startTs),
    last: 0,
    first: 0,
    max: 0,
    min: 0,
    avg: 0,
    len: 0,
    sell_times: 0,
    buy_times: 0,
    sell_volume: 0,
    buy_volume: 0,
    buy_cost: 0,
    sell_cost: 0,
});
class CandleBuilder {
    constructor(options) {
        this.resolutionMs = options.resolution * 1000;
        this.startTs = options.startTs;
        this.endTs = options.endTs;
        this.onCandle = options.onCandle;
        this.exchange = options.exchange;
        this.pair = options.pair;
        this.currentCandle = generateDefaultCandle(options.startTs + this.resolutionMs);
    }
    resetCandle() {
        this.currentCandle = generateDefaultCandle(this.startTs + this.resolutionMs);
    }
    moveToNextTimeSlot() {
        this.startTs = this.startTs + this.resolutionMs;
    }
    getCandle() {
        if (!this.currentCandle.avg) {
            this.currentCandle.avg = (this.currentCandle.buy_cost + this.currentCandle.sell_cost) / (this.currentCandle.buy_volume + this.currentCandle.sell_volume);
        }
        return this.currentCandle;
    }
    // step 1: must setup this before receiving first candle
    onReceiveTradeBeforeWindow(trade) {
        const ts = (0, tfUtils_1.getTs)(trade);
        if (ts >= this.startTs) {
            throw new Error(`${this.exchange} ${this.pair} onReceiveTradeBeforeWindow invalid ts > ${this.startTs}`);
        }
        const r = (0, tfUtils_1.getR)(trade);
        this.currentCandle.last = r;
        this.currentCandle.max = r;
        this.currentCandle.min = r;
        this.currentCandle.first = r;
    }
    // step 2: process all transaction streams
    onReceiveTransaction(trade) {
        const ts = (0, tfUtils_1.getTs)(trade);
        if (ts < this.startTs) {
            console.error(`${this.exchange} ${this.pair} skip ts < this.startTs ${this.startTs}`, trade);
            return;
        }
        const cutOffTs = this.startTs + this.resolutionMs;
        if (ts > cutOffTs) {
            // first, emit last candle generated event
            this.onCandle(this.getCandle());
            // check if we need to back fill
            while (ts - (this.startTs + this.resolutionMs) > this.resolutionMs) {
                this.generateBackfillCandle();
                this.moveToNextTimeSlot();
            }
            this.resetCandle();
            this.moveToNextTimeSlot();
        }
        this.addToCandle(trade);
    }
    // step 3: fill in blanks for all remaining transactions
    onTransactionEnd() {
        while (this.currentCandle.date.getTime() < this.endTs) {
            this.generateBackfillCandle();
            this.moveToNextTimeSlot();
        }
    }
    generateBackfillCandle() {
        const lastCandle = this.currentCandle;
        this.currentCandle = generateDefaultCandle(lastCandle.date.getTime() + this.resolutionMs);
        this.currentCandle.last = lastCandle.last;
        this.currentCandle.first = lastCandle.first;
        this.currentCandle.max = lastCandle.max;
        this.currentCandle.min = lastCandle.min;
        if (lastCandle.code) {
            this.currentCandle.code = lastCandle.code;
        }
        console.log(`${this.exchange} ${this.pair} backfill generated for ${this.currentCandle.date.toISOString()}`);
        this.onCandle(this.getCandle());
    }
    addToCandle(trade) {
        const side = (0, tfUtils_1.getSide)(trade);
        const amount = (0, tfUtils_1.getAmount)(trade);
        const price = (0, tfUtils_1.getR)(trade);
        const candle = this.currentCandle;
        if (candle.len === 0) {
            candle.first = price;
            // use end date as candle date
            candle.date = new Date(this.startTs + this.resolutionMs);
            if ((0, tfUtils_1.getDeliveryCode)(trade)) {
                candle.code = (0, tfUtils_1.getDeliveryCode)(trade).toString();
            }
        }
        if (side === 'sell' && amount > 0) {
            candle.sell_times += 1;
            candle.sell_volume += amount;
            candle.sell_cost += price * amount;
        }
        else if (amount > 0) {
            candle.buy_times += 1;
            candle.buy_volume += amount;
            candle.buy_cost += price * amount;
        }
        candle.len++;
        candle.last = price;
        candle.max = Math.max(price, candle.max);
        if (!candle.min) {
            candle.min = price;
        }
        else {
            candle.min = Math.min(price, candle.min);
        }
    }
}
exports.CandleBuilder = CandleBuilder;
