import { getCurrencies } from '../paymentMethod/getCurrencies'

export const hasMopsConfigured = (meansOfPayment: MeansOfPayment) => getCurrencies(meansOfPayment).length > 0
