import { defaultAccount, setAccount } from '..'
import { chatStorage } from '../chatStorage'
import { storeChats } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'
import { resetStorage } from '../../../../tests/unit/prepare'

describe('storeChats', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would store chats', async () => {
    await storeChats(accountData.buyer.chats)
    expect(chatStorage.setMapAsync).toHaveBeenCalledWith('313-312', accountData.buyer.chats['313-312'])
  })
})
