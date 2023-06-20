import { useTransactionHistorySetup } from './useTransactionHistorySetup'
import { renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useWalletState } from '../../../utils/wallet/walletStore'

describe('useTransactionHistorySetup', () => {
  it('should return transactions, refresh and isRefreshing', () => {
    const { result } = renderHook(useTransactionHistorySetup, { wrapper: NavigationWrapper })
    expect(result.current.transactions).toEqual([])
    expect(result.current.refresh).toBeInstanceOf(Function)
    expect(result.current.isRefreshing).toBe(false)
  })
  it('should set up the header correctly', () => {
    renderHook(useTransactionHistorySetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should return the stored transactions sorted by date and mapped to TxSummary type', () => {
    useWalletState.setState({
      transactions: [
        {
          txid: '1',
          sent: 0,
          received: 25000,
          fee: 10000,
          confirmationTime: {
            height: 765432,
            timestamp: 1234567890,
          },
        },
        {
          txid: '2',
          sent: 0,
          received: 25000,
          fee: 10000,
          confirmationTime: {
            height: 765432,
            timestamp: 1234567890,
          },
        },
      ],
    })
    const { result } = renderHook(useTransactionHistorySetup, { wrapper: NavigationWrapper })
    expect(result.current.transactions).toEqual([
      {
        amount: 25000,
        confirmed: true,
        contractId: undefined,
        currency: 'EUR',
        date: new Date('2009-02-13T23:31:30.000Z'),
        id: '1',
        offerId: undefined,
        price: NaN,
        type: 'DEPOSIT',
      },
      {
        amount: 25000,
        confirmed: true,
        contractId: undefined,
        currency: 'EUR',
        date: new Date('2009-02-13T23:31:30.000Z'),
        id: '2',
        offerId: undefined,
        price: NaN,
        type: 'DEPOSIT',
      },
    ])
  })
})
