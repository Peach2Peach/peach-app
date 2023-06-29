import { sort } from '../array'

export const getReceivingAddress = (transaction?: Transaction | null) => {
  const output = transaction?.vout?.sort(sort('value')).pop()
  if (output) return output.scriptpubkey_address
  return undefined
}
