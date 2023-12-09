import { getCurrencies } from '../paymentMethod'

export const hasMopsConfigured = (meansOfPayment: MeansOfPayment) => getCurrencies(meansOfPayment).length > 0
