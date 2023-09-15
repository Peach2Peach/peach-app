import { act, fireEvent, render } from '@testing-library/react-native'
import { buyOffer, matchOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { validSEPAData } from '../../../tests/unit/data/paymentData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { Match } from './Match'
import { useMatchStore } from './store'

const getRandomMock = jest.fn().mockReturnValue(Buffer.from('totallyRandom'))
jest.mock('../../utils/crypto/getRandom', () => ({
  getRandom: () => getRandomMock(),
}))
const paymentDataSignature = 'signature'
const paymentDataEncrypted = 'encrypted'
const createEncryptedPaymentDataMock = jest.fn().mockResolvedValue({
  encrypted: paymentDataEncrypted,
  signature: paymentDataSignature,
})
jest.mock('./utils/createEncryptedPaymentData', () => ({
  createEncryptedPaymentData: (...args: unknown[]) => createEncryptedPaymentDataMock(...args),
}))

const matchOfferMock = jest.fn()
const getOfferDetailsMock = jest.fn().mockResolvedValue([matchOffer, null])
jest.mock('../../utils/peachAPI', () => ({
  matchOffer: (...args: unknown[]) => matchOfferMock(...args),
  getOfferDetails: (...args: unknown[]) => getOfferDetailsMock(...args),
}))

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
  it('should render correctly for buy offers', () => {
    const { toJSON } = render(<Match match={{ ...matchOffer, matched: false }} offer={buyOffer} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly for sell offers', () => {
    const { toJSON } = render(<Match match={{ ...matchOffer, matched: false }} offer={sellOffer} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly for matched offers', () => {
    const { toJSON } = render(<Match match={matchOffer} offer={buyOffer} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })
    expect(toJSON()).toMatchSnapshot()
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
    const { getByText } = render(<Match match={{ ...matchOffer, matched: false }} offer={buyOffer} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })

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
    })
  })
})
