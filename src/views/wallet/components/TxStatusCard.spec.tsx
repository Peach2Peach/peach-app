import { fireEvent, render } from 'test-utils'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { TxStatusCard } from './TxStatusCard'

describe('TxStatusCard', () => {
  const date = new Date('2022-09-15T07:23:25.797Z')
  const baseTx: Pick<TransactionSummary, 'amount' | 'date' | 'confirmed' | 'offerData'> = {
    amount: 123456,
    date,
    confirmed: false,
    offerData: [],
  }
  const buyTradeTx: TransactionSummary = {
    ...baseTx,
    id: 'buyTradeTx',
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
    const { toJSON } = render(<TxStatusCard item={buyTradeTx} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed buy trade tx', () => {
    const { toJSON } = render(<TxStatusCard item={{ ...buyTradeTx, confirmed: true }} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending sent tx', () => {
    const { toJSON } = render(<TxStatusCard item={sentTx} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending confirmed tx', () => {
    const { toJSON } = render(<TxStatusCard item={{ ...sentTx, confirmed: true }} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending refund tx', () => {
    const { toJSON } = render(<TxStatusCard item={refundTx} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed refund tx', () => {
    const { toJSON } = render(<TxStatusCard item={{ ...refundTx, confirmed: true }} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending receive tx', () => {
    const { toJSON } = render(<TxStatusCard item={receiveTx} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed receive tx', () => {
    const { toJSON } = render(<TxStatusCard item={{ ...receiveTx, confirmed: true }} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a escrow funded tx', () => {
    const { toJSON } = render(<TxStatusCard item={{ ...escrowFundedTx, confirmed: true }} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should navigate to the transaction details screen when pressed', () => {
    const { getByText } = render(<TxStatusCard item={receiveTx} />)
    fireEvent.press(getByText('received'))
    expect(navigateMock).toHaveBeenCalledWith('transactionDetails', { txId: 'receiveTx' })
  })
  it('should not render the fiat price', () => {
    const { queryByText } = render(<TxStatusCard item={receiveTx} />)
    expect(queryByText('100.00 EUR')).toBeFalsy()
  })
})
