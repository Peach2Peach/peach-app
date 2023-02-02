import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { chatStorage } from '../../../../../src/utils/account/chatStorage'
import { storeChats } from '../../../../../src/utils/account/storeAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

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
