import { Inst, OpCode } from 'qs-typings';
export declare function convertOpCode(str: string): OpCode;
export declare function mapInstructionsToOpCode(inst: any[]): Inst.Instruction[];
