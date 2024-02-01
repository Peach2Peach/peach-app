const OVERHEAD = 10.5;
const INPUT_SIZE = 68;
const OUTPUT_SIZE = 46;
export const estimateTransactionSize = (inputs: number, outputs: number) => {
  const inputSize = INPUT_SIZE * inputs;
  const outputSize = OUTPUT_SIZE * outputs;
  return OVERHEAD + inputSize + outputSize;
};
