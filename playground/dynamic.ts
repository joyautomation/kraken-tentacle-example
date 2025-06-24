import {
  PlcModbusSource,
  PlcVariableBoolean,
  PlcVariableBooleanWithModbusSource,
  PlcVariableNumber,
} from "@joyautomation/tentacle";

type Sources = {
  motorModbus: PlcModbusSource;
};
type Variables = {
  count: PlcVariableNumber;
};

type Range<F extends number, T extends number> =
  | Exclude<Enumerate<T extends number ? T : never>, Enumerate<F>>
  | F
  | T;
type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

type motorIds = `motor${Range<1, 20>}`;

type MotorBooleanVariables = `startCommand` | `stopCommand`;
type MotorBooleanWithModbusSourceVariables = `start` | `running` | `remote`;

type motorVariables = {
  [key in `${motorIds}.${MotorBooleanVariables}`]: PlcVariableBoolean;
} & {
  [key in `${motorIds}.${MotorBooleanWithModbusSourceVariables}`]: PlcVariableBooleanWithModbusSource<Sources>;
};
