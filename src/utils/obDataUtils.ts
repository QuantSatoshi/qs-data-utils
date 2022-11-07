import * as mongodb from 'mongodb';
const deepEqual = require('deep-equal');
import { OrderBookSchema, OrderBookDataSchema } from 'qs-typings';

export function convertObAmountToBtcNotion(ob: OrderBookSchema) {
  ob.bids?.forEach((bid) => {
    bid.a = bid.a / bid.r;
  });
  ob.asks?.forEach((ask) => {
    ask.a = ask.a / ask.r;
  });
}

export function searchForOb(obs: OrderBookSchema[], startIndex: number, unixTimestamp: number) {
  for (let i = startIndex; i < obs.length; i++) {
    const ts = (obs[i].ts as any) instanceof Date ? (obs[i].ts as any).getTime() : obs[i].ts;
    if (ts === unixTimestamp) {
      return { idx: i, ob: obs[i] };
    } else if (ts > unixTimestamp) {
      // console.warn(`unexpected ob[i] ${i} ${obs[i].ts.toISOString()} > ts=${new Date(unixTimestamp).toISOString()}`);
      return { idx: startIndex, ob: null };
    }
  }
  return { idx: startIndex, ob: null };
}

export async function getShallowObs(
  collection: mongodb.Collection,
  startDate: Date | string,
  endDate: Date | string,
  depth = 3,
) {
  const data = await collection
    .find<OrderBookSchema>(
      {
        ts: { $gte: new Date(startDate), $lt: new Date(endDate) },
      },
      {},
    )
    .sort({ ts: 1 })
    .project({ bids: { $slice: depth }, asks: { $slice: depth }, ts: 1, _id: 0 })
    .toArray();
  return data;
}

export function pickSameTs(data1: { ts: Date }[], data2: { ts: Date }[]): any {
  if (data1.length === data2.length) return [data1, data2];
  const retA = [];
  const retB = [];
  let i = 0;
  let j = 0;
  while (i < data1.length && j < data2.length) {
    if (!data1[i] || !data2[j]) break;
    if (data1[i].ts.getTime() < data2[j].ts.getTime()) {
      // data 1 has extra data, and skip it
      i++;
      continue;
    } else if (data1[i].ts.getTime() > data2[j].ts.getTime()) {
      // data 2 has extra data, and skip it
      j++;
      continue;
    } else {
      retA.push(data1[i]);
      retB.push(data2[j]);
    }
    i++;
    j++;
  }
  console.error(
    `!!!pickSameTs length not equal before=${data1.length} ${data2.length}, after=${retA.length} ${retB.length}`,
  );
  return [retA, retB];
}

export function takeDepth(obs: OrderBookDataSchema, depth: number): OrderBookDataSchema {
  return {
    pair: obs.pair,
    bids: obs.bids.slice(0, depth),
    asks: obs.asks.slice(0, depth),
    ts: obs.ts,
  };
}

export function isEqual(arr1: any[], arr2: any[]) {
  return deepEqual(arr1, arr2);
}

export function isObSame(ob1: OrderBookDataSchema, ob2: OrderBookDataSchema) {
  return isEqual(ob1.asks, ob2.asks) && isEqual(ob1.bids, ob2.bids);
}
