import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { chatStorage } from '../../../../../src/utils/account/chatStorage'
import { storeChat } from '../../../../../src/utils/account/storeAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('storeChat', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would store chats', async () => {
    await storeChat(accountData.buyer.chats['313-312'])
    expect(chatStorage.setMap).toHaveBeenCalledWith('313-312', accountData.buyer.chats['313-312'])
  })
})
