import { strictEqual } from 'assert'
import { setAccount } from '../../../../src/utils/account'
import { getOfferHexIdFromContract } from '../../../../src/utils/contract'
import * as accountData from '../../data/accountData'
import * as contractData from '../../data/contractData'

describe('getOfferHexIdFromContract', () => {
  it('gets offer id for seller', async () => {
    await setAccount(accountData.seller)
    strictEqual(getOfferHexIdFromContract(contractData.contract), 'PE')
  })
  it('gets offer id for buyer', async () => {
    await setAccount(accountData.buyer)
    strictEqual(getOfferHexIdFromContract(contractData.contract), 'PF')
  })
})
