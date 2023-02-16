import { deepStrictEqual } from 'assert'
import { getMessage, setMessage } from '../../../src/contexts/message'

describe('getMessage & setMessage', () => {
  const newMessage: MessageState = {
    msg: 'Test',
    level: 'OK' as Level,
  }
  it('sets message state', () => {
    setMessage({}, newMessage)
    deepStrictEqual(getMessage().msg, newMessage.msg)
    deepStrictEqual(getMessage().level, newMessage.level)
  })
})
