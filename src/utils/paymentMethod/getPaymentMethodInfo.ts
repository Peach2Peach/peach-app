import { PAYMENTMETHODINFOS } from '../../constants'

export const getPaymentMethodInfo = (id: string) => PAYMENTMETHODINFOS.find((p) => p.id === id)
