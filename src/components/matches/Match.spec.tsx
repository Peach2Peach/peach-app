import { Match } from './Match'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import { buyOffer, matchOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { useMatchStore } from './store'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'

const matchOfferMock = jest.fn()
const getOfferDetailsMock = jest.fn().mockResolvedValue([matchOffer, null])
jest.mock('../../utils/peachAPI', () => ({
  matchOffer: (...args: unknown[]) => matchOfferMock(...args),
  getOfferDetails: (...args: unknown[]) => getOfferDetailsMock(...args),
}))

jest.useFakeTimers()

describe('Match', () => {
  beforeEach(() => {
    useMatchStore.setState({ matchSelectors: {} })
    queryClient.clear()
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
      currency: 'EUR',
      paymentMethod: 'sepa',
      paymentDataEncrypted: undefined,
      paymentDataSignature: undefined,
      symmetricKeyEncrypted: undefined,
      symmetricKeySignature: undefined,
    })
  })

  it('should not match if the premium of the match has changed', async () => {
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
    getOfferDetailsMock.mockResolvedValueOnce([
      {
        ...matchOffer,
        premium: matchOffer.premium + 1,
      },
      null,
    ])
    const { getByText } = render(<Match match={{ ...matchOffer, matched: false }} offer={buyOffer} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })

    await act(async () => {
      fireEvent.press(getByText('match offer'))
      await jest.runAllTimersAsync()
    })
    expect(matchOfferMock).not.toHaveBeenCalled()
  })

  it('should invalidate the match cache if the premium of the match has changed', async () => {
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
    queryClient.setQueryData(['matches', buyOffer.id], { pages: [{ matches: [matchOffer] }] })
    getOfferDetailsMock.mockResolvedValueOnce([
      {
        ...matchOffer,
        premium: matchOffer.premium + 1,
      },
      null,
    ])
    const { getByText } = render(<Match match={{ ...matchOffer, matched: false }} offer={buyOffer} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })

    await act(async () => {
      fireEvent.press(getByText('match offer'))
      await jest.runAllTimersAsync()
    })
    expect(queryClient.getQueryState(['matches', buyOffer.id])?.isInvalidated).toBe(true)
  })

  it('should prevent a match when the matchOffer is no longer online', async () => {
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
    queryClient.setQueryData(['matches', buyOffer.id], { pages: [{ matches: [matchOffer] }] })
    getOfferDetailsMock.mockResolvedValueOnce([null, { error: 'OFFER IS OFFLINE' }])
    const { getByText } = render(<Match match={{ ...matchOffer, matched: false }} offer={buyOffer} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })

    await act(async () => {
      fireEvent.press(getByText('match offer'))
      await jest.runAllTimersAsync()
    })
    expect(queryClient.getQueryState(['matches', buyOffer.id])?.isInvalidated).toBe(true)
  })
})
