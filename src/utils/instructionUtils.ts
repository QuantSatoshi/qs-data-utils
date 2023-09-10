import { InstFuture, OpCode } from 'qs-typings';

// convert string op to number op code
export function convertOpCode(str: string): OpCode {
  switch (str) {
    case 'cancelAllOrders':
      return OpCode.cancelAllOrders;
    case 'cancelOrder':
      return OpCode.cancelOrder;
    case 'createLimitOrder':
      return OpCode.createLimitOrder;
    case 'updateOrder':
      return OpCode.updateOrder;
    case 'createStopLimitOrder':
      return OpCode.createStopLimitOrder;
    case 'createMarketOrder':
      return OpCode.createMarketOrder;
    case 'limitClosePosition':
      return OpCode.limitClosePosition;
    case 'marketClosePosition':
      return OpCode.marketClosePosition;
    default:
      throw new Error(`invalid instruction ${str}`);
  }
}

// map instruction from string op to number op
// input inst is similar structure as Inst.Instruction but with string op
export function mapInstructionsToOpCode(inst: any[]): InstFuture.Instruction[] {
  return inst.map((instruction) => {
    return {
      ...instruction,
      op: convertOpCode(instruction.op),
    } as any;
  });
}
