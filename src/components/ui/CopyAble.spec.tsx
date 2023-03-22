import React from 'react'
import Clipboard from '@react-native-clipboard/clipboard'

import { create } from 'react-test-renderer'
import { CopyAble, CopyRef } from './CopyAble'
import { Pressable, View } from 'react-native'

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}))

jest.mock('../animation/Fade', () => ({
  Fade: () => <View />,
}))

describe('CopyAble', () => {
  const value = 'value'

  it('should copy value to clipboard', () => {
    const testInstance = create(<CopyAble {...{ value }} />).root
    testInstance.findByType(Pressable).props.onPress()
    expect(Clipboard.setString).toHaveBeenCalledWith(value)
  })
  it('should forward reference', () => {
    let $copy = null
    create(<CopyAble forwardRef={(r: CopyRef) => ($copy = r)} {...{ value }} />)
    expect($copy).toEqual({
      copy: expect.any(Function),
    })
  })
})
