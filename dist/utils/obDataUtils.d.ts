import * as mongodb from 'mongodb';
import { OrderBookSchema, OrderBookDataSchema } from 'qs-typings';
export declare function convertObAmountToBtcNotion(ob: OrderBookSchema): void;
export declare function searchForOb(obs: OrderBookSchema[], startIndex: number, unixTimestamp: number): {
    idx: number;
    ob: OrderBookSchema;
} | {
    idx: number;
    ob: null;
};
export declare function getShallowObs(collection: mongodb.Collection, startDate: Date | string, endDate: Date | string, depth?: number): Promise<mongodb.Document[]>;
export declare function pickSameTs(data1: {
    ts: Date;
}[], data2: {
    ts: Date;
}[]): any;
export declare function takeDepth(obs: OrderBookDataSchema, depth: number): OrderBookDataSchema;
export declare function isEqual(arr1: any[], arr2: any[]): any;
export declare function isObSame(ob1: OrderBookDataSchema, ob2: OrderBookDataSchema): any;
