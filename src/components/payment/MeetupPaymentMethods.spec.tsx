import { fireEvent, render } from 'test-utils'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { MeetupPaymentMethods } from './MeetupPaymentMethods'

describe('MeetupPaymentMethods', () => {
  const cashPaymentData: PaymentData = { id: '1', type: 'cash.someMeetup', label: 'EINUNDZWANZIG', currencies: ['EUR'] }
  const cashPaymentData2: PaymentData = {
    id: '2',
    type: 'cash.someMeetup',
    label: 'ZWEIUNDZWANZIG',
    currencies: ['EUR'],
  }
  const editItemMock = jest.fn()
  const selectMock = jest.fn()
  const isSelectedMock = jest.fn(() => false)
  const defaultProps = {
    isEditing: false,
    editItem: editItemMock,
    select: selectMock,
    isSelected: isSelectedMock,
  }
  beforeEach(() => {
    usePaymentDataStore.getState().reset()
  })
  it('should render correctly without available methods', () => {
    const { toJSON } = render(<MeetupPaymentMethods {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with available methods', () => {
    usePaymentDataStore.getState().addPaymentData(cashPaymentData)
    usePaymentDataStore.getState().addPaymentData(cashPaymentData2)
    const { toJSON } = render(<MeetupPaymentMethods {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when editing', () => {
    usePaymentDataStore.getState().addPaymentData(cashPaymentData)
    const { toJSON } = render(<MeetupPaymentMethods {...defaultProps} isEditing />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should call select when clicked', () => {
    usePaymentDataStore.getState().addPaymentData(cashPaymentData)
    const { getByText } = render(<MeetupPaymentMethods {...defaultProps} />)
    fireEvent.press(getByText(cashPaymentData.label))
    expect(selectMock).toHaveBeenCalled()
  })

  it('should render correctly with selected', () => {
    usePaymentDataStore.getState().addPaymentData(cashPaymentData)
    isSelectedMock.mockReturnValue(true)
    const { toJSON } = render(<MeetupPaymentMethods {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should call editItem when clicked and isEditing', () => {
    usePaymentDataStore.getState().addPaymentData(cashPaymentData)
    const { getByText } = render(<MeetupPaymentMethods {...defaultProps} isEditing />)
    fireEvent.press(getByText(cashPaymentData.label))
    expect(editItemMock).toHaveBeenCalled()
  })
})
