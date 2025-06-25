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

type MotorVariables = {
  [key in `${motorIds}.${MotorBooleanVariables}`]: PlcVariableBoolean;
} & {
  [key in `${motorIds}.${MotorBooleanWithModbusSourceVariables}`]: PlcVariableBooleanWithModbusSource<Sources>;
};

const generateBooleanVariable = (
  config: { id: string } & Partial<PlcVariableBoolean>
): PlcVariableBoolean => ({
  description: `Description was not provided.`,
  datatype: "boolean" as const,
  default: false,
  ...config,
});

const generateBooleanWithModbusSourceVariable = (config: {
  id: string;
  description?: string;
  default?: boolean;
  source: Partial<PlcVariableBooleanWithModbusSource<Sources>["source"]>;
}): PlcVariableBooleanWithModbusSource<Sources> => ({
  id: config.id,
  description: config.description ?? "Description was not provided.",
  datatype: "boolean" as const,
  default: false,
  source: {
    id: "motorModbus",
    type: "modbus",
    rate: 1000,
    register: 0,
    registerType: "COIL",
    format: "INT16",
    ...config.source,
  },
});

type MotorConfig = {
  [key in motorIds]: {
    [key in MotorBooleanWithModbusSourceVariables]: number;
  };
};

// Type guard function for MotorConfig
function isMotorConfig(obj: unknown): obj is MotorConfig {
  if (!obj || typeof obj !== "object") return false;

  // Check that all required motor keys exist and no more than necessary
  if (Object.keys(obj).length !== 20) return false;

  // Check that all required motor keys exist
  for (let i = 1; i <= 20; i++) {
    const motorKey = `motor${i}`;

    // Check if the motor key exists
    if (!(motorKey in obj)) return false;

    const motor = (obj as Record<string, unknown>)[motorKey];
    if (!motor || typeof motor !== "object") return false;

    // Check that all required properties exist and are numbers
    const requiredProps: MotorBooleanWithModbusSourceVariables[] = [
      "start",
      "running",
      "remote",
    ];
    for (const prop of requiredProps) {
      if (
        !(prop in motor) ||
        typeof (motor as Record<string, unknown>)[prop] !== "number"
      ) {
        return false;
      }
    }
  }

  return true;
}

const getMotorConfig = (): MotorConfig => {
  // Create the config using Object.fromEntries
  const config = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => {
      return [
        `motor${i + 1}`,
        {
          start: 3 * i + 1,
          running: 3 * i + 2,
          remote: 3 * i + 3,
        },
      ];
    })
  );

  // Validate the config using the type guard
  if (!isMotorConfig(config)) {
    throw new Error("Invalid motor configuration generated");
  }

  // Now TypeScript knows config is of type MotorConfig
  return config;
};

const motorConfig = getMotorConfig();

console.log(motorConfig);

const getMotorVariables = () => {
  return;
};

console.log(getMotorVariables());
