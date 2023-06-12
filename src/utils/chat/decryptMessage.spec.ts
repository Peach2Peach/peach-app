import OpenPGP from 'react-native-fast-openpgp'
import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../account'
import { decryptMessage } from '.'
import * as chatData from '../../../tests/unit/data/chatData'
import { encrypt } from '../crypto'

describe('decryptMessage', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('decrypts message if it doesn\'t exist', async () => {
    jest.spyOn(OpenPGP, 'decryptSymmetric').mockResolvedValue('decryptedMessage')
    const encryptedMessage: Message = {
      message: encrypt('decryptedMessage', 'symKey'),
      date: new Date('2021-01-01'),
      from: '0x123',
      roomId: 'roomId',
      readBy: [],
      signature: 'signature',
    }
    const decrypted = await decryptMessage(chatData.chat1, 'symKey')(encryptedMessage)
    expect(decrypted).toStrictEqual({
      date: new Date('2021-01-01'),
      from: '0x123',
      message: 'decryptedMessage',
      readBy: [],
      roomId: 'roomId',
      signature: 'signature',
    })
  })

  it('returns null if message cannot be decrypted', async () => {
    jest.spyOn(OpenPGP, 'decryptSymmetric').mockRejectedValue(new Error('error'))
    const encryptedMessage: Message = {
      message: encrypt('decryptedMessage', 'symKey'),
      date: new Date('2021-01-01'),
      from: '0x123',
      roomId: 'roomId',
      readBy: [],
      signature: 'signature',
    }
    const decrypted = await decryptMessage(chatData.chat1, 'symKey')(encryptedMessage)
    expect(decrypted).toStrictEqual({
      date: new Date('2021-01-01'),
      from: '0x123',
      message: null,
      readBy: [],
      roomId: 'roomId',
      signature: 'signature',
    })
  })

  it('takes already decrypted message', async () => {
    const decrypted = await Promise.all(chatData.chat1.messages.map(decryptMessage(chatData.chat1, 'symKey')))
    deepStrictEqual(decrypted, chatData.chat1.messages)
  })
})
