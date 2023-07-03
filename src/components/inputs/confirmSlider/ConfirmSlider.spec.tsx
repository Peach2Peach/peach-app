import { render } from '@testing-library/react-native'
import { ConfirmSlider } from './ConfirmSlider'
import { createRenderer } from 'react-test-renderer/shallow'
import { fireSwipeEvent } from '../../../../tests/unit/helpers/fireSwipeEvent'

describe('ConfirmSlider', () => {
  const renderer = createRenderer()
  const onConfirm = jest.fn()

  it('renders correctly', () => {
    renderer.render(<ConfirmSlider label1="label1" label2="label2" onConfirm={() => {}} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders with different icon', () => {
    renderer.render(<ConfirmSlider label1="label1" label2="label2" onConfirm={() => {}} iconId="award" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when not enabled', () => {
    renderer.render(<ConfirmSlider label1="label1" label2="label2" onConfirm={() => {}} enabled={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('calls onConfirm on swipe to end', () => {
    const { getByTestId } = render(<ConfirmSlider label1="label1" onConfirm={onConfirm} />)
    fireSwipeEvent({ element: getByTestId('confirmSlider'), x: 260 })
    expect(onConfirm).toHaveBeenCalled()
  })
  it('does not call onConfirm on incomplete swipe', () => {
    const { getByTestId } = render(<ConfirmSlider label1="label1" onConfirm={onConfirm} />)
    fireSwipeEvent({ element: getByTestId('confirmSlider'), x: 183 })
    expect(onConfirm).not.toHaveBeenCalled()
  })
  it('does not call onConfirm on swipe to end if not enabled', () => {
    const { getByTestId } = render(<ConfirmSlider label1="label1" onConfirm={onConfirm} enabled={false} />)
    fireSwipeEvent({ element: getByTestId('confirmSlider'), x: 260 })
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
