import { getBitcoinAddressParts } from './getBitcoinAddressParts'

describe('getBitcoinAddressParts', () => {
  it('should return an object with 4 parts of the address', () => {
    const address = 'bc1qmnvxru45p3wcjgngd66duz5awtwk636y0llrnna7cqafu3kdu9csr8vdj5'

    expect(getBitcoinAddressParts(address)).toEqual({
      one: 'bc1q',
      two: 'mnvxr',
      three: 'u45p3wcjgngd66duz5awtwk636y0llrnna7cqafu3kdu9csr',
      four: '8vdj5',
    })
  })
})
