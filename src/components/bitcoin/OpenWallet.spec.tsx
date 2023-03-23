import React from 'react'
import { TouchableOpacity } from 'react-native'
import { create } from 'react-test-renderer'
import { openInWallet } from '../../utils/bitcoin'
import { OpenWallet } from './OpenWallet'

jest.mock('../../utils/bitcoin/openInWallet', () => ({
  openInWallet: jest.fn(),
}))

describe('OpenWallet', () => {
  const address = 'address'

  it('should call openInWallet with address', () => {
    const testInstance = create(<OpenWallet {...{ address }} />).root
    // @ts-ignore
    testInstance.findByType(TouchableOpacity).props.onPress()
    expect(openInWallet).toHaveBeenCalledWith(`bitcoin:${address}`)
  })
  it('should call openInWallet without address', () => {
    const testInstance = create(<OpenWallet />).root
    // @ts-ignore
    testInstance.findByType(TouchableOpacity).props.onPress()
    expect(openInWallet).toHaveBeenCalledWith('bitcoin:')
  })
})
