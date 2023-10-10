import { fireEvent, render } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { TxStatusCard } from './TxStatusCard'

const wrapper = NavigationWrapper

describe('TxStatusCard', () => {
  const date = new Date('2022-09-15T07:23:25.797Z')
  const baseTx: Pick<TransactionSummary, 'amount' | 'price' | 'currency' | 'date' | 'confirmed'> = {
    amount: 123456,
    price: 100,
    currency: 'EUR',
    date,
    confirmed: false,
  }
  const buyTradeTx: TransactionSummary = {
    ...baseTx,
    id: 'buyTradeTx',
    offerId: '123',
    type: 'TRADE',
  }
  const sentTx: TransactionSummary = {
    ...baseTx,
    id: 'sendTx',
    type: 'WITHDRAWAL',
  }
  const refundTx: TransactionSummary = {
    ...baseTx,
    id: 'refundTx',
    offerId: '123',
    type: 'REFUND',
  }
  const receiveTx: TransactionSummary = {
    ...baseTx,
    id: 'receiveTx',
    type: 'DEPOSIT',
  }
  const escrowFundedTx: TransactionSummary = {
    ...baseTx,
    id: 'receiveTx',
    type: 'ESCROWFUNDED',
  }

  it('should render correctly for a pending buy trade tx', () => {
    const { toJSON } = render(<TxStatusCard item={buyTradeTx} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed buy trade tx', () => {
    const { toJSON } = render(<TxStatusCard item={{ ...buyTradeTx, confirmed: true }} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending sent tx', () => {
    const { toJSON } = render(<TxStatusCard item={sentTx} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending confirmed tx', () => {
    const { toJSON } = render(<TxStatusCard item={{ ...sentTx, confirmed: true }} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending refund tx', () => {
    const { toJSON } = render(<TxStatusCard item={refundTx} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed refund tx', () => {
    const { toJSON } = render(<TxStatusCard item={{ ...refundTx, confirmed: true }} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending receive tx', () => {
    const { toJSON } = render(<TxStatusCard item={receiveTx} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed receive tx', () => {
    const { toJSON } = render(<TxStatusCard item={{ ...receiveTx, confirmed: true }} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a escrow funded tx', () => {
    const { toJSON } = render(<TxStatusCard item={{ ...escrowFundedTx, confirmed: true }} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should navigate to the transaction details screen when pressed', () => {
    const { getByText } = render(<TxStatusCard item={receiveTx} />, { wrapper })
    fireEvent.press(getByText('received'))
    expect(navigateMock).toHaveBeenCalledWith('transactionDetails', { txId: 'receiveTx' })
  })
  it('should not render the fiat price', () => {
    const { queryByText } = render(<TxStatusCard item={receiveTx} />, { wrapper })
    expect(queryByText('100.00 EUR')).toBeFalsy()
  })
})
