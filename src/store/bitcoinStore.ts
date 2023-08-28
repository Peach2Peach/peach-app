import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { SATSINBTC } from '../constants'
import { error } from '../utils/log'
import { createStorage } from '../utils/storage'
import { dateTimeReviver } from '../utils/system'

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

export const defaultBitcoinState: BitcoinState = {
  currency: 'EUR',
  satsPerUnit: NaN,
  price: NaN,
  prices: {},
}

export const bitcoinStorage = createStorage('bitcoin')

export const useBitcoinStore = create(
  persist<BitcoinStore>(
    (set, get) => ({
      ...defaultBitcoinState,
      setCurrency: (currency) => set({ currency }),
      setSatsPerUnit: (satsPerUnit) => set({ satsPerUnit }),
      setPrice: (price) => set({ price }),
      setPrices: (prices) => {
        const price = prices[get().currency] ?? get().price
        get().setPrice(price)
        get().setSatsPerUnit(Math.round(SATSINBTC / price))
        set({ prices })
      },
    }),
    {
      name: 'bitcoin',
      version: 0,
      storage: createJSONStorage(() => ({
        setItem: async (name: string, value: unknown) => {
          await bitcoinStorage.setItem(name, JSON.stringify(value))
        },
        getItem: async (name: string) => {
          const value = await bitcoinStorage.getItem(name)
          try {
            if (typeof value === 'string') return JSON.parse(value, dateTimeReviver)
          } catch (e) {
            error(e)
          }
          return null
        },
        removeItem: (name: string) => {
          bitcoinStorage.removeItem(name)
        },
      })),
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState

        const mergedState = { ...currentState, ...persistedState }
        if (mergedState.price === null) mergedState.price = NaN
        if (mergedState.satsPerUnit === null) mergedState.satsPerUnit = NaN
        return mergedState
      },
    },
  ),
)
