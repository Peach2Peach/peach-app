import { isKYCRequired } from './isKYCRequired'

export const isPaymentRequired = (contract: Contract) => !isKYCRequired(contract) && contract.paymentMade === null
