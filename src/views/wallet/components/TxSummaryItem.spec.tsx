import { NavigationContainer } from '@react-navigation/native'
import { render } from '@testing-library/react-native'
import { TxSummaryItem } from './TxSummaryItem'

const wrapper = NavigationContainer

describe('OfferItem', () => {
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

  it('should render correctly for a pending buy trade tx', () => {
    const { toJSON } = render(<TxSummaryItem tx={buyTradeTx} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed buy trade tx', () => {
    const { toJSON } = render(<TxSummaryItem tx={{ ...buyTradeTx, confirmed: true }} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending sent tx', () => {
    const { toJSON } = render(<TxSummaryItem tx={sentTx} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending confirmed tx', () => {
    const { toJSON } = render(<TxSummaryItem tx={{ ...sentTx, confirmed: true }} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending refund tx', () => {
    const { toJSON } = render(<TxSummaryItem tx={refundTx} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed refund tx', () => {
    const { toJSON } = render(<TxSummaryItem tx={{ ...refundTx, confirmed: true }} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a pending receive tx', () => {
    const { toJSON } = render(<TxSummaryItem tx={receiveTx} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for a confirmed receive tx', () => {
    const { toJSON } = render(<TxSummaryItem tx={{ ...receiveTx, confirmed: true }} />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})