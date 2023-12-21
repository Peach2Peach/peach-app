import { getContractViewer } from './getContractViewer'

describe('getContractViewer', () => {
  it('returns "seller" if account publicKey matches seller id', () => {
    const account = { publicKey: '02def' }
    expect(getContractViewer('02def', account)).toBe('seller')
  })

  it('returns "buyer" if account publicKey does not match seller id', () => {
    const account = { publicKey: '03abc' }
    expect(getContractViewer('02def', account)).toBe('buyer')
  })
})
