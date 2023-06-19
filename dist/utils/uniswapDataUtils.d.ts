export interface UniswapV3BacktestResult {
    ts: number;
    high: number;
    low: number;
    close: number;
    feeToken0: number;
    feeToken1: number;
    tokens: number[];
    feeV: number;
    feeUnb: number;
    amountV: number;
    amountTR: number;
    feeUSD: number;
    baseClose: number;
}
export declare function uniswapV3JsonToArr(results: UniswapV3BacktestResult[]): number[][];
export declare function uniswapV3ArrToJson(arr: number[][]): UniswapV3BacktestResult[];
