import {
  createTentacle,
  PlcMqtts,
  PlcSources,
  PlcVariableNumber,
} from "@joyautomation/tentacle";

type Mqtts = PlcMqtts;
type Sources = PlcSources;
type Variables = {
  count: PlcVariableNumber;
};

const main = await createTentacle<Mqtts, Sources, Variables>({
  tasks: {
    main: {
      name: "main",
      description: "The main task",
      scanRate: 1000,
      program: (variables, setVar) => {
        setVar("count", variables.count.value + 1);
      },
    },
  },
  mqtt: {},
  sources: {},
  variables: {
    count: {
      id: "count",
      description: "Keeps count of how many time the main task has run",
      datatype: "number",
      default: 0,
      decimals: 0,
    },
  },
});

main();
