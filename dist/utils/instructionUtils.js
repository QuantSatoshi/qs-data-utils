"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInstructionsToOpCode = exports.convertOpCode = void 0;
const qs_typings_1 = require("qs-typings");
// convert string op to number op code
function convertOpCode(str) {
    switch (str) {
        case 'cancelAllOrders':
            return qs_typings_1.OpCode.cancelAllOrders;
        case 'cancelOrder':
            return qs_typings_1.OpCode.cancelOrder;
        case 'createLimitOrder':
            return qs_typings_1.OpCode.createLimitOrder;
        case 'updateOrder':
            return qs_typings_1.OpCode.updateOrder;
        case 'createStopLimitOrder':
            return qs_typings_1.OpCode.createStopLimitOrder;
        case 'createMarketOrder':
            return qs_typings_1.OpCode.createMarketOrder;
        case 'limitClosePosition':
            return qs_typings_1.OpCode.limitClosePosition;
        case 'marketClosePosition':
            return qs_typings_1.OpCode.marketClosePosition;
        default:
            throw new Error(`invalid instruction ${str}`);
    }
}
exports.convertOpCode = convertOpCode;
// map instruction from string op to number op
// input inst is similar structure as Inst.Instruction but with string op
function mapInstructionsToOpCode(inst) {
    return inst.map((instruction) => {
        return Object.assign(Object.assign({}, instruction), { op: convertOpCode(instruction.op) });
    });
}
exports.mapInstructionsToOpCode = mapInstructionsToOpCode;
