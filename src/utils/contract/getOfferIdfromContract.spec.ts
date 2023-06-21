import { strictEqual } from 'assert'
import { setAccount } from '../account'
import { getOfferIdFromContract } from '.'
import * as accountData from '../../../tests/unit/data/accountData'
import * as contractData from '../../../tests/unit/data/contractData'

describe('getOfferIdFromContract', () => {
  it('gets offer id for seller', () => {
    setAccount(accountData.seller)
    strictEqual(getOfferIdFromContract(contractData.contract), '14')
  })
  it('gets offer id for buyer', () => {
    setAccount(accountData.buyer)
    strictEqual(getOfferIdFromContract(contractData.contract), '15')
  })
})
