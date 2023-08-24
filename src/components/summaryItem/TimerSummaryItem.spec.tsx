import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { MSINAMINUTE, MSINANHOUR } from '../../constants'
import { TimerSummaryItem } from './TimerSummaryItem'

const now = new Date('2022-03-08T11:41:07.245Z')
jest.useFakeTimers({ now })

describe('TimerSummaryItem', () => {
  const renderer = createRenderer()
  const onPress = jest.fn()
  const end = Date.now() + MSINANHOUR + MSINAMINUTE + MSINAMINUTE / 2
  it('renders correctly', () => {
    renderer.render(<TimerSummaryItem title="rating" end={end} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with icon', () => {
    renderer.render(<TimerSummaryItem title="rating" end={end} iconId="checkCircle" iconColor={'#BADA55'} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly with action', () => {
    renderer.render(
      <TimerSummaryItem title="rating" end={end} iconId="checkCircle" iconColor={'#BADA55'} onPress={onPress} />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('action is triggered when pressed', () => {
    const { getByText } = render(
      <TimerSummaryItem title="rating" end={end} iconId="checkCircle" iconColor={'#BADA55'} onPress={onPress} />,
    )
    fireEvent.press(getByText('01:01:30'))
    expect(onPress).toHaveBeenCalled()
  })
})
