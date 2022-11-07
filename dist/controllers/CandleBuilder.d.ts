import { TradeDbSchemaV2, CandleDbSchema } from 'qs-typings';
declare type OnCandle = (candle: CandleDbSchema) => any;
export declare class CandleBuilder {
    resolutionMs: number;
    startTs: number;
    endTs: number;
    exchange: string;
    pair: string;
    onCandle: OnCandle;
    currentCandle: CandleDbSchema;
    constructor(options: {
        resolution: number;
        startTs: number;
        onCandle: OnCandle;
        endTs: number;
        exchange: string;
        pair: string;
    });
    private resetCandle;
    private moveToNextTimeSlot;
    getCandle(): CandleDbSchema;
    onReceiveTradeBeforeWindow(trade: TradeDbSchemaV2): void;
    onReceiveTransaction(trade: TradeDbSchemaV2): void;
    onTransactionEnd(): void;
    private generateBackfillCandle;
    private addToCandle;
}
export {};
