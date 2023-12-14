import Clipboard from '@react-native-clipboard/clipboard'
import { Pressable, View } from 'react-native'
import { act, create } from 'react-test-renderer'
import { Fade } from '../animation/Fade'
import { CopyAble, CopyRef } from './CopyAble'

jest.useFakeTimers()

jest.mock('../animation/Fade', () => ({
  Fade: (_props: { show: boolean }) => <View />,
}))

describe('CopyAble', () => {
  const value = 'value'

  it('should copy value to clipboard', () => {
    const testInstance = create(<CopyAble {...{ value }} />).root
    act(() => {
      testInstance.findByType(Pressable).props.onPress()
    })
    expect(Clipboard.setString).toHaveBeenCalledWith(value)
  })
  it('should show Fade for 5 seconds', () => {
    const renderer = create(<CopyAble {...{ value }} />)
    const testInstance = renderer.root
    act(() => {
      testInstance.findByType(Pressable).props.onPress()
    })
    expect(testInstance.findByType(Fade).props.show).toBeTruthy()
    act(() => {
      jest.runAllTimers()
    })
    expect(testInstance.findByType(Fade).props.show).toBeFalsy()
  })
  it("should not copy if there's no value", () => {
    const testInstance = create(<CopyAble />).root
    act(() => {
      testInstance.findByType(Pressable).props.onPress()
    })

    expect(Clipboard.setString).not.toHaveBeenCalled()
  })
  it('should forward reference', () => {
    let $copy = null
    create(<CopyAble forwardRef={(r: CopyRef) => ($copy = r)} {...{ value }} />)
    expect($copy).toEqual({
      copy: expect.any(Function),
    })
  })
})
