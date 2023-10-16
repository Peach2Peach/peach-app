import { View } from 'react-native'
import { render } from 'test-utils'
import { pendingTransactionSummary, transactionWithRBF1 } from '../../../../../tests/unit/data/transactionDetailData'
import { OfferData } from './OfferData'

const useTransactionDetailsMock = jest.fn().mockReturnValue({ transaction: transactionWithRBF1 })
jest.mock('../../../../hooks/query/useTransactionDetails', () => ({
  useTransactionDetails: () => useTransactionDetailsMock(),
}))

jest.mock('../../../../components/animation/Fade', () => ({
  Fade: (_props: { show: boolean }) => <View />,
}))

jest.useFakeTimers()

describe('OfferData', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <OfferData
        price={123}
        currency="EUR"
        amount={10000}
        address={transactionWithRBF1.vout[0].scriptpubkey_address}
        transaction={pendingTransactionSummary}
        type="WITHDRAWAL"
      />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly without  price, currency and address', () => {
    const { toJSON } = render(<OfferData amount={100000} transaction={pendingTransactionSummary} type="WITHDRAWAL" />)
    expect(toJSON()).toMatchSnapshot()
  })
})
