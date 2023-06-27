import { render } from '@testing-library/react-native'
import { SlideToUnlock } from './SlideToUnlock'
import { createRenderer } from 'react-test-renderer/shallow'
import { fireSwipeEvent } from '../../../tests/unit/helpers/fireSwipeEvent'

describe('SlideToUnlock', () => {
  const renderer = createRenderer()
  const onUnlock = jest.fn()

  it('renders correctly', () => {
    renderer.render(<SlideToUnlock label1="label1" label2="label2" onUnlock={onUnlock} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders with different icon', () => {
    renderer.render(<SlideToUnlock label1="label1" label2="label2" onUnlock={onUnlock} iconId="award" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    renderer.render(<SlideToUnlock label1="label1" label2="label2" onUnlock={onUnlock} disabled />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('calls onUnlock on swipe to end', () => {
    const { getByTestId } = render(<SlideToUnlock label1="label1" onUnlock={onUnlock} />)
    fireSwipeEvent({ element: getByTestId('confirmSlider'), x: 260 })
    expect(onUnlock).toHaveBeenCalled()
  })
  it('does not call onUnlock on swipe to end if disabled', () => {
    const { getByTestId } = render(<SlideToUnlock label1="label1" onUnlock={onUnlock} disabled />)
    fireSwipeEvent({ element: getByTestId('confirmSlider'), x: 260 })
    expect(onUnlock).not.toHaveBeenCalled()
  })
})
