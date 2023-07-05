import { fireEvent, render } from '@testing-library/react-native'
import { account, updateAccount } from '../../utils/account'
import { MeetupPaymentMethods } from './MeetupPaymentMethods'

describe('MeetupPaymentMethods', () => {
  const editItemMock = jest.fn()
  const selectMock = jest.fn()
  const isSelectedMock = jest.fn(() => false)
  const defaultProps = {
    isEditing: false,
    editItem: editItemMock,
    select: selectMock,
    isSelected: isSelectedMock,
  }
  afterEach(() => {
    jest.clearAllMocks()
    updateAccount({ ...account, paymentData: [] })
  })
  it('should render correctly without available methods', () => {
    const { toJSON } = render(<MeetupPaymentMethods {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with available methods', () => {
    updateAccount({
      ...account,
      paymentData: [
        { id: '1', type: 'cash', label: 'EINUNDZWANZIG', currencies: ['EUR'] },
        { id: '2', type: 'cash', label: 'ZWEIUNDZWANZIG', currencies: ['EUR'] },
      ],
    })
    const { toJSON } = render(<MeetupPaymentMethods {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when editing', () => {
    updateAccount({ ...account, paymentData: [{ id: '1', type: 'cash', label: 'EINUNDZWANZIG', currencies: ['EUR'] }] })
    const { toJSON } = render(<MeetupPaymentMethods {...defaultProps} isEditing />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should call select when clicked', () => {
    updateAccount({ ...account, paymentData: [{ id: '1', type: 'cash', label: 'EINUNDZWANZIG', currencies: ['EUR'] }] })
    const { getByTestId } = render(<MeetupPaymentMethods {...defaultProps} />)
    fireEvent.press(getByTestId('payment-details-checkbox'))
    expect(selectMock).toHaveBeenCalled()
  })

  it('should render correctly with selected', () => {
    updateAccount({ ...account, paymentData: [{ id: '1', type: 'cash', label: 'EINUNDZWANZIG', currencies: ['EUR'] }] })
    isSelectedMock.mockReturnValue(true)
    const { toJSON } = render(<MeetupPaymentMethods {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should call editItem when clicked and isEditing', () => {
    updateAccount({ ...account, paymentData: [{ id: '1', type: 'cash', label: 'EINUNDZWANZIG', currencies: ['EUR'] }] })
    const { getByTestId } = render(<MeetupPaymentMethods {...defaultProps} isEditing />)
    fireEvent.press(getByTestId('payment-details-checkbox'))
    expect(editItemMock).toHaveBeenCalled()
  })
})
