import { fireEvent, render } from '@testing-library/react-native'
import { SummaryItem } from './SummaryItem'

jest.mock('../../text', () => ({
  Text: 'Text',
}))

jest.mock('../../bitcoin', () => ({
  BTCAmount: 'BTCAmount',
}))

const showAddressMock = jest.fn()
jest.mock('../../../utils/bitcoin', () => ({
  showAddress: (address: string, network: BitcoinNetwork) => showAddressMock(address, network),
}))

describe('SummaryItem', () => {
  const defaultProps = {
    label: 'label',
    information: 'information',
    icon: <></>,
    isBitcoinAmount: false,
    isEscrow: false,
  } as const
  const windowDimensionsSpy = jest.spyOn(jest.requireActual('react-native'), 'useWindowDimensions')
  it('renders correctly', () => {
    const { toJSON } = render(<SummaryItem {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly for escrow', () => {
    const { toJSON } = render(<SummaryItem {...defaultProps} isEscrow />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly for escrow with non string information', () => {
    // @ts-expect-error
    const { toJSON } = render(<SummaryItem {...defaultProps} isEscrow information={1} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should open the address on press', () => {
    const { getByText } = render(<SummaryItem {...defaultProps} isEscrow information={'address'} />)
    fireEvent.press(getByText('view in explorer'))
    expect(showAddressMock).toHaveBeenCalledWith('address', 'regtest')
  })

  it('renders correctly for bitcoin amount', () => {
    windowDimensionsSpy.mockReturnValueOnce({ width: 375, height: 690 })
    const { toJSON } = render(<SummaryItem {...defaultProps} isBitcoinAmount information={21000} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly for bitcoin amount on small screens', () => {
    windowDimensionsSpy.mockReturnValueOnce({ width: 374, height: 689 })
    const { toJSON } = render(<SummaryItem {...defaultProps} isBitcoinAmount information={21000} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly for active dispute', () => {
    const { toJSON } = render(<SummaryItem {...defaultProps} isDisputeActive />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly for should blur', () => {
    const { toJSON } = render(<SummaryItem {...defaultProps} shouldBlur />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly for not available', () => {
    const { toJSON } = render(<SummaryItem {...defaultProps} isAvailable={false} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly for not available and active dispute', () => {
    const { toJSON } = render(<SummaryItem {...defaultProps} isAvailable={false} isDisputeActive />)
    expect(toJSON()).toMatchSnapshot()
  })
})
