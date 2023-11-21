import { getContractViewer } from './getContractViewer'

describe('getContractViewer', () => {
  it('returns "seller" if account publicKey matches seller id', () => {
    const account: Partial<Account> = { publicKey: '02def' }
    const seller: Partial<User> = { id: '02def' }
    const buyer: Partial<User> = { id: '03abc' }
    const contract: Partial<Contract> = { seller: seller as User, buyer: buyer as User }
    expect(getContractViewer(contract as Contract, account as Account)).toBe('seller')
  })

  it('returns "buyer" if account publicKey does not match seller id', () => {
    const account: Partial<Account> = { publicKey: '03abc' }
    const seller: Partial<User> = { id: '02def' }
    const buyer: Partial<User> = { id: '03abc' }
    const contract: Partial<Contract> = { seller: seller as User, buyer: buyer as User }
    expect(getContractViewer(contract as Contract, account as Account)).toBe('buyer')
  })
})
