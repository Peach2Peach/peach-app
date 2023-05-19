import { seller } from './accountData'

export const match: Match = {
  amount: 210000,
  premium: 7,
  unavailable: { exceedsLimit: [] },
  user: { id: seller.publicKey } as User,
  meansOfPayment: {
    EUR: ['sepa'],
    CHF: ['sepa'],
  },
  prices: {
    EUR: 1,
    CHF: 1.1,
  },
}
