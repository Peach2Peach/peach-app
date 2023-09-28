import { fireEvent, render } from '@testing-library/react-native'
import { usePopupStore } from '../../store/usePopupStore'
import { NodeConnectionSuccessPopup } from './NodeConnectionSuccessPopup'

describe('NodeConnectionSuccessPopup', () => {
  const save = jest.fn()
  it('should render correctly', () => {
    const { toJSON } = render(<NodeConnectionSuccessPopup address="address" save={save} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should save node config and close popup', () => {
    const closePopupSpy = jest.spyOn(usePopupStore.getState(), 'closePopup')
    const { getByText } = render(<NodeConnectionSuccessPopup address="address" save={save} />)
    fireEvent.press(getByText('save node info'))
    expect(save).toHaveBeenCalled()
    expect(closePopupSpy).toHaveBeenCalled()
  })
})
