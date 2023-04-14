import { NATIONALTRANSFERCOUNTRIES } from '../../../constants'

export const nationalTransferFields = NATIONALTRANSFERCOUNTRIES.reduce((obj, c) => {
  const id: PaymentMethod = `nationalTransfer${c}`
  obj[id] = ['beneficiary', 'iban', 'accountNumber', 'bic', 'address']
  return obj
}, {} as Record<NationalTransfer, (keyof PaymentData)[]>)
