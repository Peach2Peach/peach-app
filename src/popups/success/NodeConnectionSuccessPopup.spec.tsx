import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { usePopupStore } from '../../store/usePopupStore'
import { NodeConnectionSuccessPopup } from './NodeConnectionSuccessPopup'

describe('NodeConnectionSuccessPopup', () => {
  const save = jest.fn()
  it('should render correctly', () => {
    const { toJSON } = render(<NodeConnectionSuccessPopup url="url" save={save} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should save node config and close popup', async () => {
    const closePopupSpy = jest.spyOn(usePopupStore.getState(), 'closePopup')
    const { getByText } = render(<NodeConnectionSuccessPopup url="url" save={save} />)

    fireEvent.press(getByText('save node info'))
    await waitFor(() => expect(save).toHaveBeenCalled())
    expect(closePopupSpy).toHaveBeenCalled()
  })
})
