import { handleBroadcastError } from './handleBroadcastError'

describe('handleBroadcastError', () => {
  // https://github.com/bitcoindevkit/bdk/blob/8641847e6c037b7aa1a54791d36e56bfd91989f3/crates/bdk/src/error.rs#L123
  const insufficientFundsError
    = 'InsufficientFunds(message: "Insufficient funds: 1089000 sat available of 78999997952 sat needed")'
  it('should parse the error for insufficient funds', () => {
    expect(handleBroadcastError(insufficientFundsError)).toEqual([
      new Error('INSUFFICIENT_FUNDS'),
      { available: '1089000', needed: '78999997952' },
    ])
  })
  it('should return error message if not known', () => {
    const error = 'some other error'
    expect(handleBroadcastError(error)).toEqual([new Error(error)])
  })
})
