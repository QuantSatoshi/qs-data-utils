import { CandleDbSchema } from 'qs-typings';

export function candleToCandleV2(candle: CandleDbSchema): number[] {
  const ts = (() => {
    if (candle.date) return candle.date.getTime();
    if ((candle as any).ts) return (candle as any).ts; // candle keeper format
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

export function candleV2ToCandleDb(candleV2: number[]): CandleDbSchema {
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
  } as any;
}
