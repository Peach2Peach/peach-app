import { createRenderer } from 'react-test-renderer/shallow'
import { ConfirmSendAllTo } from './ConfirmSendAllTo'
import { render } from '@testing-library/react-native'
import { fireSwipeEvent } from '../../../../../tests/unit/helpers/fireSwipeEvent'

const sendAllToMock = jest.fn()
jest.mock('../../hooks/useSendAllTo', () => ({
  useSendAllTo: () => sendAllToMock,
}))

describe('ConfirmSendAllTo', () => {
  const renderer = createRenderer()
  const address = 'address'
  const onSuccess = jest.fn()
  it('renders correctly', () => {
    renderer.render(<ConfirmSendAllTo {...{ address, onSuccess }} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('opens refund popup', () => {
    const { getByTestId } = render(<ConfirmSendAllTo {...{ address, onSuccess }} />)
    fireSwipeEvent({ element: getByTestId('confirmSlider'), x: 260 })
    expect(sendAllToMock).toHaveBeenCalled()
  })
})
