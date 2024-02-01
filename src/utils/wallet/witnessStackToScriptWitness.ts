// eslint-disable-next-line @typescript-eslint/no-var-requires
const varuint = require("varuint-bitcoin");

/**
 * @description Method to convert witness stack to script witness
 * @param witness witness stack
 * @returns script witness
 */
export const witnessStackToScriptWitness = (witness: Buffer[]): Buffer => {
  let buffer = Buffer.allocUnsafe(0);

  const writeSlice = (slice: Buffer): void => {
    buffer = Buffer.concat([buffer, Buffer.from(slice)]);
  };

  const writeVarInt = (i: number): void => {
    const currentLen = buffer.length;
    const varintLen = varuint.encodingLength(i);

    buffer = Buffer.concat([buffer, Buffer.allocUnsafe(varintLen)]);
    varuint.encode(i, buffer, currentLen);
  };

  const writeVarSlice = (slice: Buffer): void => {
    writeVarInt(slice.length);
    writeSlice(slice);
  };

  const writeVector = (vector: Buffer[]): void => {
    writeVarInt(vector.length);
    vector.forEach(writeVarSlice);
  };

  writeVector(witness);

  return buffer;
};
