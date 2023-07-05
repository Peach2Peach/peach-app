import { sort } from '../array'

export const getHighestValueOutputAddress = (transaction?: Transaction | null) => {
  const outputs = transaction?.vout?.sort(sort('value')) || []
  if (outputs.length) return outputs[outputs.length - 1].scriptpubkey_address
  return undefined
}
