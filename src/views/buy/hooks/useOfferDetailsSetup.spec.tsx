import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { account1, paymentData } from '../../../../tests/unit/data/accountData'
import { settings1 } from '../../../../tests/unit/data/settingsData'
import { defaultAccount, setAccount } from '../../../utils/account'
import { getBuyOfferDraft } from '../helpers/getBuyOfferDraft'
import { useOfferDetailsSetup } from './useOfferDetailsSetup'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'

const showHelpMock = jest.fn()
const useShowHelpMock = jest.fn((..._args) => showHelpMock)
jest.mock('../../../hooks/useShowHelp', () => ({
  useShowHelp: (...args: any) => useShowHelpMock(...args),
}))

const setMeansOfPaymentMock = jest.fn()
const useSettingsStoreMock = jest.fn((selector) =>
  selector({
    preferredPaymentMethods: settings1.preferredPaymentMethods,
    meansOfPayment: settings1.meansOfPayment,
    setMeansOfPayment: setMeansOfPaymentMock,
  }),
)
jest.mock('../../../store/settingsStore', () => ({
  ...jest.requireActual('../../../store/settingsStore'),
  useSettingsStore: (selector: any) => useSettingsStoreMock(selector),
}))

describe('useOfferDetailsSetup', () => {
  const fakeAccount = { ...account1, paymentData }
  const minBuyAmount = 1
  const maxBuyAmount = 10
  const meansOfPayment = {}
  const offerDraft = getBuyOfferDraft({
    minBuyAmount,
    maxBuyAmount,
    meansOfPayment,
  })
  const setOfferDraftMock = jest.fn()
  const initialProps = {
    offerDraft,
    setOfferDraft: setOfferDraftMock,
  }
  afterEach(async () => {
    jest.clearAllMocks()
  })

  it('should return default values', () => {
    setAccount(defaultAccount)
    const { result } = renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })

    expect(result.current.paymentData).toEqual([])
    expect(result.current.isEditing).toEqual(false)
    expect(result.current.setMeansOfPayment).toEqual(setMeansOfPaymentMock)
    expect(result.current.toggleIsEditing).toBeInstanceOf(Function)
    expect(result.current.isStepValid).toEqual(false)
  })
  it('should return default values with existing payment data', () => {
    setAccount(fakeAccount)
    const { result } = renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })

    expect(result.current.paymentData).toEqual(fakeAccount.paymentData)
  })

  it('should add the correct header', () => {
    setAccount(defaultAccount)
    renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should add correct header for account with payment data', () => {
    setAccount(fakeAccount)
    const { result } = renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })
    expect(headerState.header()).toMatchSnapshot()
    expect(headerState.header().props.icons?.[0].onPress).toEqual(result.current.toggleIsEditing)
  })
  it('should add the correct while editing header', () => {
    setAccount(fakeAccount)
    const { result } = renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })

    act(() => {
      result.current.toggleIsEditing()
    })
    expect(result.current.isEditing).toBeTruthy()
    expect(headerState.header()).toMatchSnapshot()
    expect(headerState.header().props.icons?.[0].onPress).toEqual(result.current.toggleIsEditing)
    expect(headerState.header().props.icons?.[1].onPress).toEqual(showHelpMock)
  })
  it('should update offer draft on init', () => {
    setAccount(defaultAccount)
    renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })

    expect(setOfferDraftMock).toHaveBeenCalled()
  })
})
