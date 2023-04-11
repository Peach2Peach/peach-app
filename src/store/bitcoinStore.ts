import { createStore, useStore } from 'zustand'
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

export const bitcoinStore = createStore(
  persist<BitcoinStore>(
    (set, get) => ({
      ...defaultState,
      setCurrency: (currency: Currency) => set((state) => ({ ...state, currency })),
      setSatsPerUnit: (satsPerUnit: number) => set((state) => ({ ...state, satsPerUnit })),
      setPrice: (price: number) => set((state) => ({ ...state, price })),
      setPrices: (prices: Pricebook) => {
        const price = prices[get().currency] || get().price
        get().setPrice(price)
        get().setSatsPerUnit(Math.round(SATSINBTC / price))
        set((state) => ({ ...state, prices }))
      },
    }),
    {
      name: 'bitcoin',
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(bitcoinStorage)),
    }
  )
)

export const useBitcoinStore = <T>(
  selector: (state: BitcoinStore) => T,
  equalityFn?: ((a: T, b: T) => boolean) | undefined
) => useStore(bitcoinStore, selector, equalityFn)
