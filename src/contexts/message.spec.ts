import { deepStrictEqual } from 'assert'
import { getMessage, setMessage } from './message'

describe('getMessage & setMessage', () => {
  const newMessage: MessageState = {
    msgKey: 'Test',
    level: 'OK' as Level,
  }
  it('sets message state', () => {
    setMessage({}, newMessage)
    deepStrictEqual(getMessage().msgKey, newMessage.msgKey)
    deepStrictEqual(getMessage().level, newMessage.level)
  })
})
