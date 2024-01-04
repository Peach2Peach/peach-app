import { getMessageToSignForAddress } from './getMessageToSignForAddress'

describe('getMessageToSignForAddress', () => {
  it('creates a message to sign for compliance', () => {
    expect(getMessageToSignForAddress('userId', 'address')).toEqual(
      'I confirm that only I, peachuserId, control the address address',
    )
  })
})
