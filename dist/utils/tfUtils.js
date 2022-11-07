"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tfV2ToTf = exports.tfToTfV2 = exports.isNumber = exports.tfArrToTfV2 = exports.numberToPairDb = exports.pairDbToNumber = exports.getMinMaxFirstLast = exports.getOHLC = exports.futurePairDbToExpPairDb = exports.getSymbolsFromPairDb = exports.getDeliveryCode = exports.getServerTime = exports.getPairNum = exports.getAmount = exports.getR = exports.getSide = exports.getTs = exports.SELL = exports.BUY = void 0;
exports.BUY = 'buy';
exports.SELL = 'sell';
function getTs(doc) {
    return doc[0];
}
exports.getTs = getTs;
function getSide(doc) {
    return doc[1] === 0 ? exports.BUY : exports.SELL;
}
exports.getSide = getSide;
function getR(doc) {
    return doc[2];
}
exports.getR = getR;
function getAmount(doc) {
    return doc[3];
}
exports.getAmount = getAmount;
function getPairNum(doc) {
    return doc[4];
}
exports.getPairNum = getPairNum;
function getServerTime(doc) {
    return doc[5];
}
exports.getServerTime = getServerTime;
function getDeliveryCode(doc) {
    return doc[6];
}
exports.getDeliveryCode = getDeliveryCode;
function getSymbolsFromPairDb(pairDb) {
    if (pairDb.match(/CW|CQ|NW|NQ$/)) {
        // we need to find the middle item.
        const splits = pairDb.split('_').reverse();
        const asset = splits[1];
        const currency = splits[2] || 'USD';
        return { asset, currency };
    }
    const [currency, asset] = pairDb.split('_');
    if (!asset) {
        return { asset: currency, currency };
    }
    return { asset, currency };
}
exports.getSymbolsFromPairDb = getSymbolsFromPairDb;
const numberToPairDbsMap = [
    'USD_BTC_perpetual_swap',
    'USD_BTC',
    'USDT_BTC',
    'USD_ETH_perpetual_swap',
    'USD_ETH',
    'BTC_ETH',
    'BTC_ADA',
    'BTC_LTC',
    'BTC_BCH',
    'BTC_XLM',
    'BTC_EOS',
    'USDT_ETH',
    'USDT_BTC_perpetual_swap',
    'USDT_ETH_perpetual_swap',
    'USDT_DOT_perpetual_swap',
    'USDT_BNB',
    'BUSD_BNB',
    'USD_BNB_perpetual_swap',
    'USDT_BNB_perpetual_swap',
    'USDT_DOT',
    'USD_DOT_perpetual_swap',
    'USDT_DOT_perpetual_swap',
    'USDT_FIL',
    'USDT_FIL_perpetual_swap',
];
const numberToExchangesMap = [
    'bitmex_fx',
    'gdax',
    'binance',
    'binance_fx',
    'bitfinex',
    'hbdm_fx',
    'okcoin_fx',
    'okex_swap_fx',
    'itbit',
    'bybit',
];
const pairDbToNumberMap = (() => {
    const map = {};
    numberToPairDbsMap.forEach((pairDb, i) => {
        map[pairDb] = i;
    });
    return map;
})();
const exchangeToNumberMap = (() => {
    const map = {};
    numberToExchangesMap.forEach((exchange, i) => {
        map[exchange] = i;
    });
    return map;
})();
// Convert BTC_CQ to USD_BTC_20200925
function futurePairDbToExpPairDb(pairDb, exp) {
    const expStr = exp < 20000000 ? `20${exp}` : `${exp}`;
    const symbol = getSymbolsFromPairDb(pairDb).asset;
    return `USD_${symbol}_${expStr}`;
}
exports.futurePairDbToExpPairDb = futurePairDbToExpPairDb;
function getOHLC(transactions) {
    const { last, first, max, min } = getMinMaxFirstLast(transactions);
    return {
        open: first,
        close: last,
        high: max,
        low: min,
    };
}
exports.getOHLC = getOHLC;
function getMinMaxFirstLast(transactions) {
    let max = 0, min = Number.MAX_SAFE_INTEGER, first = 0, last = 0, firstTs = Date.now(), lastTs = 0;
    for (const transaction of transactions) {
        const r = getR(transaction);
        const ts = getTs(transaction);
        if (!ts) {
            throw new Error(`getMinMaxFirstLast invalid transaction ${JSON.stringify(transaction)}`);
        }
        if (r > max) {
            max = r;
        }
        if (r < min) {
            min = r;
        }
        if (ts < firstTs) {
            firstTs = ts;
            first = r;
        }
        if (ts > lastTs) {
            lastTs = ts;
            last = r;
        }
    }
    return {
        last,
        first,
        max,
        min,
    };
}
exports.getMinMaxFirstLast = getMinMaxFirstLast;
function pairDbToNumber(pairDb, exchange) {
    let exchangeValue = 0;
    if (exchange) {
        if (exchangeToNumberMap[exchange] === undefined) {
            numberToExchangesMap.push(exchange);
            exchangeToNumberMap[exchange] = numberToExchangesMap.indexOf(exchange);
        }
        exchangeValue = exchangeToNumberMap[exchange] + 1;
    }
    if (pairDbToNumberMap[pairDb] === undefined) {
        numberToPairDbsMap.push(pairDb);
        pairDbToNumberMap[pairDb] = numberToPairDbsMap.indexOf(pairDb);
        console.log(`pairDbToNumber adding pairDb`, pairDb);
    }
    const pairDbValue = pairDbToNumberMap[pairDb] + 1;
    // const matchFuturePair = pairDb.match(/(.*)_(\d\d\d\d\d\d)$/);
    // if (matchFuturePair && matchFuturePair[2]) {
    //   pairDbValue = parseInt(matchFuturePair[2]) * 100 + pairDbToNumberMap[matchFuturePair[1]] + 1;
    // }
    return pairDbValue * 100 + exchangeValue;
}
exports.pairDbToNumber = pairDbToNumber;
function numberToPairDb(pairDbExchangeCode) {
    const exchangeCode = pairDbExchangeCode % 100;
    const exchange = numberToExchangesMap[exchangeCode - 1];
    const pairDbCode = (pairDbExchangeCode - exchangeCode) / 100;
    const pairDb = numberToPairDbsMap[pairDbCode - 1];
    return { pairDb, exchange };
}
exports.numberToPairDb = numberToPairDb;
function tfArrToTfV2(tfArr, pairDb, exchange) {
    // const [ ts, s, r ,a , c ] = doc;
    return tfArr.map((tf) => tfToTfV2(tf, pairDb, exchange));
}
exports.tfArrToTfV2 = tfArrToTfV2;
function formatDelivery(delivery) {
    if (!!delivery.match(/-/)) {
        // okex old format
        return delivery.slice(2).replace(/-/g, '');
    }
    return delivery;
}
function isNumber(value) {
    return typeof value === 'number';
}
exports.isNumber = isNumber;
function tfToTfV2(tf, pairDb, exchange, withServerTime) {
    // const [ ts, s, r, a, c, t, code ] = doc;
    const timestamp = isNumber(tf.ts) ? tf.ts : tf.ts.getTime();
    const ret = [timestamp, tf.s === 'b' ? 0 : 1, tf.r, tf.a, pairDbToNumber(tf.c || pairDb, exchange)];
    if (withServerTime || tf.code) {
        const timestampServer = isNumber(tf.t) ? tf.t : tf.t.getTime();
        ret.push(timestampServer);
    }
    // for expiring contracts, always attach the exp code.
    if (tf.code) {
        ret.push(parseInt(formatDelivery(tf.code)));
    }
    return ret;
}
exports.tfToTfV2 = tfToTfV2;
function tfV2ToTf(tf) {
    // const [ ts, s, r, a, c, t, code ] = doc;
    return {
        ts: new Date(tf[0]),
        s: tf[1] === 0 ? 'b' : 's',
        r: tf[2],
        a: tf[3],
        c: tf[4].toString(),
        t: (tf[5] && new Date(tf[5])),
        code: tf[6].toString(),
        tId: 1,
    };
}
exports.tfV2ToTf = tfV2ToTf;
