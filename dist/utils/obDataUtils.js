"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObSame = exports.isEqual = exports.takeDepth = exports.pickSameTs = exports.getShallowObs = exports.searchForOb = exports.convertObAmountToBtcNotion = void 0;
const deepEqual = require('deep-equal');
function convertObAmountToBtcNotion(ob) {
    var _a, _b;
    (_a = ob.bids) === null || _a === void 0 ? void 0 : _a.forEach((bid) => {
        bid.a = bid.a / bid.r;
    });
    (_b = ob.asks) === null || _b === void 0 ? void 0 : _b.forEach((ask) => {
        ask.a = ask.a / ask.r;
    });
}
exports.convertObAmountToBtcNotion = convertObAmountToBtcNotion;
function searchForOb(obs, startIndex, unixTimestamp) {
    for (let i = startIndex; i < obs.length; i++) {
        const ts = obs[i].ts instanceof Date ? obs[i].ts.getTime() : obs[i].ts;
        if (ts === unixTimestamp) {
            return { idx: i, ob: obs[i] };
        }
        else if (ts > unixTimestamp) {
            // console.warn(`unexpected ob[i] ${i} ${obs[i].ts.toISOString()} > ts=${new Date(unixTimestamp).toISOString()}`);
            return { idx: startIndex, ob: null };
        }
    }
    return { idx: startIndex, ob: null };
}
exports.searchForOb = searchForOb;
function getShallowObs(collection, startDate, endDate, depth = 3) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield collection
            .find({
            ts: { $gte: new Date(startDate), $lt: new Date(endDate) },
        }, {})
            .sort({ ts: 1 })
            .project({ bids: { $slice: depth }, asks: { $slice: depth }, ts: 1, _id: 0 })
            .toArray();
        return data;
    });
}
exports.getShallowObs = getShallowObs;
function pickSameTs(data1, data2) {
    if (data1.length === data2.length)
        return [data1, data2];
    const retA = [];
    const retB = [];
    let i = 0;
    let j = 0;
    while (i < data1.length && j < data2.length) {
        if (!data1[i] || !data2[j])
            break;
        if (data1[i].ts.getTime() < data2[j].ts.getTime()) {
            // data 1 has extra data, and skip it
            i++;
            continue;
        }
        else if (data1[i].ts.getTime() > data2[j].ts.getTime()) {
            // data 2 has extra data, and skip it
            j++;
            continue;
        }
        else {
            retA.push(data1[i]);
            retB.push(data2[j]);
        }
        i++;
        j++;
    }
    console.error(`!!!pickSameTs length not equal before=${data1.length} ${data2.length}, after=${retA.length} ${retB.length}`);
    return [retA, retB];
}
exports.pickSameTs = pickSameTs;
function takeDepth(obs, depth) {
    return {
        pair: obs.pair,
        bids: obs.bids.slice(0, depth),
        asks: obs.asks.slice(0, depth),
        ts: obs.ts,
    };
}
exports.takeDepth = takeDepth;
function isEqual(arr1, arr2) {
    return deepEqual(arr1, arr2);
}
exports.isEqual = isEqual;
function isObSame(ob1, ob2) {
    return isEqual(ob1.asks, ob2.asks) && isEqual(ob1.bids, ob2.bids);
}
exports.isObSame = isObSame;
