import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { SATSINBTC } from '../constants'
import { createStorage, toZustandStorage } from '../utils/storage'

export type BitcoinState = {
  currency: Currency
  satsPerUnit: number
  price: number
  prices: Pricebook
}

type BitcoinStore = BitcoinState & {
  setCurrency: (currency: Currency) => void
  setSatsPerUnit: (satsPerUnit: number) => void
  setPrice: (price: number) => void
  setPrices: (prices: Pricebook) => void
}

const defaultState: BitcoinState = {
  currency: 'EUR',
  satsPerUnit: NaN,
  price: NaN,
  prices: {},
}

export const bitcoinStorage = createStorage('bitcoin')

export const useBitcoinStore = create(
  persist<BitcoinStore>(
    (set, get) => ({
      ...defaultState,
      setCurrency: (currency) => set({ currency }),
      setSatsPerUnit: (satsPerUnit) => set({ satsPerUnit }),
      setPrice: (price) => set({ price }),
      setPrices: (prices) => {
        const price = prices[get().currency] || get().price
        get().setPrice(price)
        get().setSatsPerUnit(Math.round(SATSINBTC / price))
        set({ prices })
      },
    }),
    {
      name: 'bitcoin',
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(bitcoinStorage)),
    },
  ),
)
