import { strictEqual } from 'assert'
import { setAccount } from '../../../../src/utils/account'
import { getOfferIdfromContract } from '../../../../src/utils/contract'
import * as accountData from '../../data/accountData'

describe('getOfferIdfromContract', () => {
  it('gets offer id for seller', async () => {
    await setAccount(accountData.contract.seller, true)
    strictEqual(getOfferIdfromContract(accountData.contract), '14')
  })
  it('gets offer id for buyer', async () => {
    await setAccount(accountData.contract.buyer, true)
    strictEqual(getOfferIdfromContract(accountData.contract), '15')
  })
})
