import { setAccount } from '../../../../src/utils/account'
import { getContract } from '../../../../src/utils/contract'
import { account1 } from '../../data/accountData'
import { contract } from '../../data/contractData'

describe('getContract', () => {
  it('returns the correct contract', () => {
    setAccount(account1)
    expect(getContract('14-15')).toEqual(contract)
  })

  it('returns undefined when the contract does not exist', () => {
    setAccount(account1)
    expect(getContract('56-78')).toBeUndefined()
  })
  it('returns undefined when account has no contracts', () => {
    setAccount({ ...account1, contracts: [] })
    expect(getContract('56-78')).toBeUndefined()
  })
})
