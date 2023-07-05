import { defaultAccount, setAccount } from '..'
import { chatStorage } from '../chatStorage'
import { storeChats } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('storeChats', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('would store chats', async () => {
    await storeChats(accountData.buyer.chats)
    expect(chatStorage.setMapAsync).toHaveBeenCalledWith('313-312', accountData.buyer.chats['313-312'])
  })
})
