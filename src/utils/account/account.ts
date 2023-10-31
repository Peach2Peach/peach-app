export const defaultLimits = {
  daily: 1000,
  dailyAmount: 0,
  monthlyAnonymous: 1000,
  monthlyAnonymousAmount: 0,
  yearly: 100000,
  yearlyAmount: 0,
}

export const defaultAccount: Account = {
  publicKey: '',
  tradingLimit: defaultLimits,
  offers: [],
  chats: {},
  pgp: {
    privateKey: '',
    publicKey: '',
  },
}

export let account = defaultAccount
export const setAccount = (acc: Account) => (account = acc)
export const getAccount = () => account
