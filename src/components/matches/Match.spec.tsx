import { toMatchDiffSnapshot } from 'snapshot-diff'
import { act, fireEvent, render } from 'test-utils'
import { buyOffer, matchOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { validSEPAData } from '../../../tests/unit/data/paymentData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { peachAPI } from '../../utils/peachAPI'
import { Match } from './Match'
import { useMatchStore } from './store'
expect.extend({ toMatchDiffSnapshot })

const getRandomMock = jest.fn().mockReturnValue(Buffer.from('totallyRandom'))
jest.mock('../../utils/crypto/getRandom', () => ({
  getRandom: () => getRandomMock(),
}))
const paymentDataSignature = 'signature'
const paymentDataEncrypted = 'encrypted'
const encryptPaymentDataMock = jest.fn().mockResolvedValue({
  encrypted: paymentDataEncrypted,
  signature: paymentDataSignature,
})

jest.mock('../../utils/paymentMethod/encryptPaymentData', () => ({
  encryptPaymentData: (...args: unknown[]) => encryptPaymentDataMock(...args),
}))

const matchOfferMock = jest.spyOn(peachAPI.private.offer, 'matchOffer')

jest.mock('../../hooks/query/useMarketPrices', () => ({
  useMarketPrices: jest.fn(() => ({
    data: {
      EUR: 400,
    },
    isSuccess: true,
  })),
}))

jest.useFakeTimers()

describe('Match', () => {
  beforeEach(() => {
    useMatchStore.setState({ matchSelectors: {} })
    queryClient.clear()
    usePaymentDataStore.getState().reset()
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
  })
  const defaultBuyComponent = <Match match={{ ...matchOffer, matched: false }} offer={buyOffer} />
  const defaultSellComponent = <Match match={{ ...matchOffer, matched: false }} offer={sellOffer} />
  it('should render correctly for buy offers', () => {
    const { toJSON } = render(defaultBuyComponent)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly for sell offers', () => {
    const { toJSON } = render(defaultSellComponent)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly for matched offers', () => {
    const { toJSON } = render(<Match match={matchOffer} offer={buyOffer} />)
    expect(render(defaultBuyComponent).toJSON()).toMatchDiffSnapshot(toJSON())
  })

  it('should match after 5 seconds', async () => {
    useMatchStore.setState({
      matchSelectors: {
        [matchOffer.offerId]: {
          availableCurrencies: ['EUR'],
          availablePaymentMethods: ['sepa'],
          selectedCurrency: 'EUR',
          selectedPaymentMethod: 'sepa',
          meansOfPayment: { EUR: ['sepa'] },
          mopsInCommon: { EUR: ['sepa'] },
          showPaymentMethodPulse: false,
        },
      },
    })
    const { getByText } = render(<Match match={{ ...matchOffer, matched: false }} offer={buyOffer} />)

    await act(async () => {
      fireEvent.press(getByText('match offer'))
      await jest.runAllTimersAsync()
    })
    expect(matchOfferMock).toHaveBeenCalledWith({
      offerId: buyOffer.id,
      matchingOfferId: matchOffer.offerId,
      price: 1,
      premium: 1.5,
      currency: 'EUR',
      paymentMethod: 'sepa',
      paymentDataEncrypted,
      paymentDataSignature,
      symmetricKeyEncrypted: undefined,
      symmetricKeySignature: undefined,
      instantTrade: false,
    })
  }, 10000)
})
