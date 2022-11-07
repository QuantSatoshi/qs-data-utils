import { TradeDbSchema, TradeDbSchemaV2 } from 'qs-typings';
export const BUY = 'buy';
export const SELL = 'sell';
export function getTs(doc: TradeDbSchemaV2): number {
  return doc[0];
}

export function getSide(doc: TradeDbSchemaV2): 'buy' | 'sell' {
  return doc[1] === 0 ? BUY : SELL;
}

export function getR(doc: TradeDbSchemaV2) {
  return doc[2];
}

export function getAmount(doc: TradeDbSchemaV2) {
  return doc[3];
}

export function getPairNum(doc: TradeDbSchemaV2) {
  return doc[4];
}

export function getServerTime(doc: TradeDbSchemaV2) {
  return doc[5];
}

export function getDeliveryCode(doc: TradeDbSchemaV2) {
  return doc[6];
}

export function getSymbolsFromPairDb(pairDb: string): { asset: string; currency: string } {
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

const pairDbToNumberMap: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  numberToPairDbsMap.forEach((pairDb, i) => {
    map[pairDb] = i;
  });
  return map;
})();

const exchangeToNumberMap: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  numberToExchangesMap.forEach((exchange, i) => {
    map[exchange] = i;
  });
  return map;
})();

// Convert BTC_CQ to USD_BTC_20200925
export function futurePairDbToExpPairDb(pairDb: string, exp: number) {
  const expStr = exp < 20000000 ? `20${exp}` : `${exp}`;
  const symbol = getSymbolsFromPairDb(pairDb).asset;
  return `USD_${symbol}_${expStr}`;
}

export function getOHLC(transactions: TradeDbSchemaV2[]) {
  const { last, first, max, min } = getMinMaxFirstLast(transactions);
  return {
    open: first,
    close: last,
    high: max,
    low: min,
  };
}

export function getMinMaxFirstLast(transactions: TradeDbSchemaV2[]) {
  let max: number = 0,
    min: number = Number.MAX_SAFE_INTEGER,
    first: number = 0,
    last: number = 0,
    firstTs: number = Date.now(),
    lastTs: number = 0;
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

export function pairDbToNumber(pairDb: string, exchange?: string) {
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

export function numberToPairDb(pairDbExchangeCode: number) {
  const exchangeCode = pairDbExchangeCode % 100;
  const exchange = numberToExchangesMap[exchangeCode - 1];
  const pairDbCode = (pairDbExchangeCode - exchangeCode) / 100;
  const pairDb = numberToPairDbsMap[pairDbCode - 1];

  return { pairDb, exchange };
}

export function tfArrToTfV2(tfArr: TradeDbSchema[], pairDb?: string, exchange?: string): TradeDbSchemaV2[] {
  // const [ ts, s, r ,a , c ] = doc;
  return tfArr.map((tf) => tfToTfV2(tf, pairDb, exchange));
}

function formatDelivery(delivery: string) {
  if (!!delivery.match(/-/)) {
    // okex old format
    return delivery.slice(2).replace(/-/g, '');
  }
  return delivery;
}

export function isNumber(value: any) {
  return typeof value === 'number';
}

export function tfToTfV2(
  tf: TradeDbSchema,
  pairDb?: string,
  exchange?: string,
  withServerTime?: boolean,
): TradeDbSchemaV2 {
  // const [ ts, s, r, a, c, t, code ] = doc;
  const timestamp: number = isNumber(tf.ts) ? (tf.ts as any) : tf.ts.getTime();
  const ret = [timestamp, tf.s === 'b' ? 0 : 1, tf.r, tf.a, pairDbToNumber(tf.c || pairDb!, exchange)];
  if (withServerTime || tf.code) {
    const timestampServer: number = isNumber(tf.t) ? (tf.t as any) : tf.t.getTime();
    ret.push(timestampServer);
  }
  // for expiring contracts, always attach the exp code.
  if (tf.code) {
    ret.push(parseInt(formatDelivery(tf.code)));
  }
  return ret;
}

export function tfV2ToTf(tf: TradeDbSchemaV2): TradeDbSchema {
  // const [ ts, s, r, a, c, t, code ] = doc;
  return {
    ts: new Date(tf[0]),
    s: tf[1] === 0 ? 'b' : 's',
    r: tf[2],
    a: tf[3],
    c: (tf[4] && tf[4].toString()) as any,
    t: (tf[5] && new Date(tf[5])) as any,
    code: (tf[6] && tf[6].toString()) as any,
    tId: 1,
  };
}
