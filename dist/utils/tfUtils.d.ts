import { TradeDbSchema, TradeDbSchemaV2 } from 'qs-typings';
export declare const BUY = "buy";
export declare const SELL = "sell";
export declare function getTs(doc: TradeDbSchemaV2): number;
export declare function getSide(doc: TradeDbSchemaV2): 'buy' | 'sell';
export declare function getR(doc: TradeDbSchemaV2): number;
export declare function getAmount(doc: TradeDbSchemaV2): number;
export declare function getPairNum(doc: TradeDbSchemaV2): number;
export declare function getServerTime(doc: TradeDbSchemaV2): number;
export declare function getDeliveryCode(doc: TradeDbSchemaV2): number;
export declare function getSymbolsFromPairDb(pairDb: string): {
    asset: string;
    currency: string;
};
export declare function futurePairDbToExpPairDb(pairDb: string, exp: number): string;
export declare function getOHLC(transactions: TradeDbSchemaV2[]): {
    open: number;
    close: number;
    high: number;
    low: number;
};
export declare function getMinMaxFirstLast(transactions: TradeDbSchemaV2[]): {
    last: number;
    first: number;
    max: number;
    min: number;
};
export declare function pairDbToNumber(pairDb: string, exchange?: string): number;
export declare function numberToPairDb(pairDbExchangeCode: number): {
    pairDb: string;
    exchange: string;
};
export declare function tfArrToTfV2(tfArr: TradeDbSchema[], pairDb?: string, exchange?: string): TradeDbSchemaV2[];
export declare function isNumber(value: any): boolean;
export declare function tfToTfV2(tf: TradeDbSchema, pairDb?: string, exchange?: string, withServerTime?: boolean): TradeDbSchemaV2;
export declare function tfV2ToTf(tf: TradeDbSchemaV2): TradeDbSchema;
