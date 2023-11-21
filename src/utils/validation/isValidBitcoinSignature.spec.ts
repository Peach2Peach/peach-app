import { isValidBitcoinSignature } from './isValidBitcoinSignature'

describe('isValidBitcoinSignature', () => {
  it('validates a bitcoin signature', () => {
    const address = 'bcrt1qj8f2z28wvqtamu7khkmhw7z025gdwr7e7n6e2n'
    const message
      = 'I confirm that only I, peach033110c3, control the address bcrt1qj8f2z28wvqtamu7khkmhw7z025gdwr7e7n6e2n'
    const signature = 'H2i3dzh/dYWjpsRJmrl1C9ZKMkg1PitsM/zdh7RIQ6PrLTaYa4Wmm0fKRsLAhaDIqwg1C51StxG5JMj3sF6Yqkc='

    const wrongAddress = 'bcrt1q58rkxe3ls4aequhcs9897r82x4kfrsz4fr4ezayluql4l55937wsmq5ck0'
    const wrongMessage
      = 'I confirm that only I, peach022334c5, control the address bcrt1qj8f2z28wvqtamu7khkmhw7z025gdwr7e7n6e2n'
    const wrongSignature = 'H2i3dzh/dO0jpsRJmrl1C9ZKMkg1PitsM/zdh7RIQ6PrLTaOa40mm0fKRsLAhaDIq0g1C51StxG5JMj3sF6Oqkc='
    expect(isValidBitcoinSignature(message, address, signature)).toEqual(true)
    expect(isValidBitcoinSignature(wrongMessage, address, signature)).toEqual(false)
    expect(isValidBitcoinSignature(message, wrongAddress, signature)).toEqual(false)
    expect(isValidBitcoinSignature(message, address, wrongSignature)).toEqual(false)
    expect(isValidBitcoinSignature(wrongMessage, wrongAddress, wrongSignature)).toEqual(false)
    expect(isValidBitcoinSignature('', address, signature)).toEqual(false)
    expect(isValidBitcoinSignature(message, '', signature)).toEqual(false)
    expect(isValidBitcoinSignature(message, address, '')).toEqual(false)
    expect(isValidBitcoinSignature('', '', '')).toEqual(false)
  })
})
