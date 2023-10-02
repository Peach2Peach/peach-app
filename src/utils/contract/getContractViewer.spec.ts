import { setAccount } from '../account'
import { getContractViewer } from './getContractViewer'

describe('getContractViewer', () => {
  it('returns "seller" if account publicKey matches seller id', () => {
    const account = { publicKey: '02def' } as Account
    setAccount(account)
    expect(getContractViewer('02def')).toBe('seller')
  })

  it('returns "buyer" if account publicKey does not match seller id', () => {
    const account = { publicKey: '03abc' } as Account
    setAccount(account)
    expect(getContractViewer('02def')).toBe('buyer')
  })
})
