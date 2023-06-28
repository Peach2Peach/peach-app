import { bitcoinStorage, bitcoinStore, defaultBitcoinState } from './bitcoinStore'

describe('bitcoinStore', () => {
  afterEach(() => {
    bitcoinStore.setState(defaultBitcoinState)
  })
  it('should return defaults', () => {
    expect(bitcoinStore.getState()).toEqual({
      currency: 'EUR',
      getPrice: expect.any(Function),
      getSatsPerUnit: expect.any(Function),
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
    bitcoinStore.getState().setPrice(price)
    expect(bitcoinStore.getState().price).toEqual(price)
    expect(bitcoinStore.getState().getPrice()).toEqual(price)
  })
  it('should set satsPerUnit', () => {
    const satsPerUnit = 1000
    bitcoinStore.getState().setSatsPerUnit(satsPerUnit)
    expect(bitcoinStore.getState().satsPerUnit).toEqual(satsPerUnit)
    expect(bitcoinStore.getState().getSatsPerUnit()).toEqual(satsPerUnit)
  })
  it('should handle persisted state with null values', async () => {

    /**
     * background: when persisting store it's stringified
     * stringifying a `NaN` value transforms into `null`
     */

    bitcoinStorage.setItem('price', 'null')
    bitcoinStorage.setItem('satsPerUnit', 'null')
    await bitcoinStore.persist.rehydrate()
    expect(bitcoinStore.getState().price).toEqual(NaN)
    expect(bitcoinStore.getState().satsPerUnit).toEqual(NaN)
  })
})
