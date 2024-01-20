import { networks } from 'bitcoinjs-lib'
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
    expect(isValidBitcoinSignature({ message, address, signature, network: networks.regtest })).toEqual(true)
    expect(isValidBitcoinSignature({ message, address, signature, network: networks.testnet })).toEqual(false)
    expect(isValidBitcoinSignature({ message, address, signature, network: networks.bitcoin })).toEqual(false)
    expect(isValidBitcoinSignature({ message: wrongMessage, address, signature, network: networks.regtest })).toEqual(
      false,
    )
    expect(isValidBitcoinSignature({ message, address: wrongAddress, signature, network: networks.regtest })).toEqual(
      false,
    )
    expect(isValidBitcoinSignature({ message, address, signature: wrongSignature, network: networks.regtest })).toEqual(
      false,
    )
    expect(
      isValidBitcoinSignature({
        message: wrongMessage,
        address: wrongAddress,
        signature: wrongSignature,
        network: networks.regtest,
      }),
    ).toEqual(false)
    expect(isValidBitcoinSignature({ message: '', address, signature, network: networks.regtest })).toEqual(false)
    expect(isValidBitcoinSignature({ message, address: '', signature, network: networks.regtest })).toEqual(false)
    expect(isValidBitcoinSignature({ message, address, signature: '', network: networks.regtest })).toEqual(false)
    expect(isValidBitcoinSignature({ message: '', address: '', signature: '', network: networks.regtest })).toEqual(
      false,
    )
  })
  it('validates a taproot signature', () => {
    const address = 'tb1ps4kv5rdvrl4k8axvc06ty0tp7hper2arwz6gy7cldjj9ppx40a9s7m9l63'
    const message
      // eslint-disable-next-line max-len
      = 'I confirm that only I, peach024118ae, control the address tb1ps4kv5rdvrl4k8axvc06ty0tp7hper2arwz6gy7cldjj9ppx40a9s7m9l63'
    const signature = 'AUFdGjkDS0GfTFaUTuyn8rNDXFlunGJu0Ljnx6vmXlFoZxoSKMUQk57ChLIphMYbzNH9Rc8Mu8qkr0PFdn/dJCdfAQ=='
    expect(isValidBitcoinSignature({ message, address, signature, network: networks.testnet })).toEqual(true)
  })
})
