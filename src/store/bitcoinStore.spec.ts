import { bitcoinStorage, useBitcoinStore, defaultBitcoinState } from './bitcoinStore'

describe('bitcoinStore', () => {
  afterEach(() => {
    useBitcoinStore.setState(defaultBitcoinState)
  })
  it('should return defaults', () => {
    expect(useBitcoinStore.getState()).toEqual({
      currency: 'EUR',
      price: NaN,
      prices: {},
      satsPerUnit: NaN,
      setCurrency: expect.any(Function),
      setPrice: expect.any(Function),
      setPrices: expect.any(Function),
      setSatsPerUnit: expect.any(Function),
    })
  })
  it('should set price', () => {
    const price = 1000
    useBitcoinStore.getState().setPrice(price)
    expect(useBitcoinStore.getState().price).toEqual(price)
  })
  it('should set satsPerUnit', () => {
    const satsPerUnit = 1000
    useBitcoinStore.getState().setSatsPerUnit(satsPerUnit)
    expect(useBitcoinStore.getState().satsPerUnit).toEqual(satsPerUnit)
  })
  it('should handle persisted state with null values', async () => {

    /**
     * background: when persisting store it's stringified
     * stringifying a `NaN` value transforms into `null`
     */

    bitcoinStorage.setItem('price', 'null')
    bitcoinStorage.setItem('satsPerUnit', 'null')
    await useBitcoinStore.persist.rehydrate()
    expect(useBitcoinStore.getState().price).toEqual(NaN)
    expect(useBitcoinStore.getState().satsPerUnit).toEqual(NaN)
  })
})
