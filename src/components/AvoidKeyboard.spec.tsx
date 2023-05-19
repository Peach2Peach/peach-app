import { AvoidKeyboard } from './AvoidKeyboard'
import { createRenderer } from 'react-test-renderer/shallow'

const isIOSMock = jest.fn().mockReturnValue(true)
jest.mock('../utils/system/isIOS', () => ({
  isIOS: () => isIOSMock(),
}))

describe('AvoidKeyboard', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<AvoidKeyboard />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly on android', () => {
    isIOSMock.mockReturnValueOnce(false)
    renderer.render(<AvoidKeyboard />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('uses the correct behavior on iOS', () => {
    renderer.render(<AvoidKeyboard iOSBehavior="height" androidBehavior="position" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('uses the correct behavior on Android', () => {
    isIOSMock.mockReturnValueOnce(false)
    renderer.render(<AvoidKeyboard iOSBehavior="height" androidBehavior="position" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
