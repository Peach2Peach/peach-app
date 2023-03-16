import { setAccount } from '../account'
import { contractExists } from '.'
import { account1 } from '../../../tests/unit/data/accountData'
import { contract } from '../../../tests/unit/data/contractData'

describe('contractExists', () => {
  it('returns true if contract with id exists in account', () => {
    setAccount(account1)
    expect(contractExists(contract.id)).toBe(true)
  })

  it('returns false if contract with id does not exist in account', () => {
    setAccount(account1)
    expect(contractExists('someotherid')).toBe(false)
  })
  it('returns false if there are no contracts in account', () => {
    setAccount({ ...account1, contracts: [] })
    expect(contractExists('contract.id')).toBe(false)
  })
})
