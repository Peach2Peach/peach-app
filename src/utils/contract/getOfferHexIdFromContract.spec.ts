import { strictEqual } from 'assert'
import { setAccount } from '../account'
import { getOfferHexIdFromContract } from '.'
import * as accountData from '../../../tests/unit/data/accountData'
import * as contractData from '../../../tests/unit/data/contractData'

describe('getOfferHexIdFromContract', () => {
  it('gets offer id for seller', () => {
    setAccount(accountData.seller)
    strictEqual(getOfferHexIdFromContract(contractData.contract), 'P‑E')
  })
  it('gets offer id for buyer', () => {
    setAccount(accountData.buyer)
    strictEqual(getOfferHexIdFromContract(contractData.contract), 'P‑F')
  })
})
