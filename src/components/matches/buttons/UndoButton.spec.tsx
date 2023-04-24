import { UndoButton } from './UndoButton'
import { fireEvent, render } from '@testing-library/react-native'
import i18n from '../../../utils/i18n'

jest.useFakeTimers()

describe('UndoButton', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<UndoButton onPress={() => {}} onTimerFinished={() => {}} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    const { getAllByText } = render(<UndoButton onPress={onPress} onTimerFinished={() => {}} />)
    const button = getAllByText(i18n('search.undo'))[0]
    fireEvent.press(button)
    expect(onPress).toHaveBeenCalled()
  })
  it('should call onTimerFinished when timer is finished', () => {
    const onTimerFinished = jest.fn()
    render(<UndoButton onPress={() => {}} onTimerFinished={onTimerFinished} />)
    jest.runAllTimers()
    expect(onTimerFinished).toHaveBeenCalled()
  })
})
