import { strictEqual } from 'assert'
import { setAccount } from '../../../../src/utils/account'
import { getOfferIdFromContract } from '../../../../src/utils/contract'
import * as accountData from '../../data/accountData'
import * as contractData from '../../data/contractData'

describe('getOfferIdFromContract', () => {
  it('gets offer id for seller', async () => {
    await setAccount(accountData.seller)
    strictEqual(getOfferIdFromContract(contractData.contract), '14')
  })
  it('gets offer id for buyer', async () => {
    await setAccount(accountData.buyer)
    strictEqual(getOfferIdFromContract(contractData.contract), '15')
  })
})
