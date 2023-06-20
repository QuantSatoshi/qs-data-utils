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

export function uniswapV3JsonToArr(results: UniswapV3BacktestResult[]): number[][] {
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

export function uniswapV3RawToJson(r: number[]): UniswapV3BacktestResult {
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

export function uniswapV3ArrToJson(arr: number[][]): UniswapV3BacktestResult[] {
  return arr.map(uniswapV3RawToJson);
}
