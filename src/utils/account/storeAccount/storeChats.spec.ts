import { defaultAccount, setAccount } from '..'
import * as accountData from '../../../../tests/unit/data/accountData'
import { chatStorage } from '../chatStorage'
import { storeChats } from './storeChats'

describe('storeChats', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('would store chats', async () => {
    await storeChats(accountData.buyer.chats)
    expect(chatStorage.setMapAsync).toHaveBeenCalledWith('313-312', accountData.buyer.chats['313-312'])
  })
})
