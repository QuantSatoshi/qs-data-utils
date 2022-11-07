import { CandleDbSchema } from 'qs-typings';
export declare function candleToCandleV2(candle: CandleDbSchema): number[];
export declare function candleV2ToCandleDb(candleV2: number[]): CandleDbSchema;
