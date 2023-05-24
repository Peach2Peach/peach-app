import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { account1, paymentData } from '../../../../tests/unit/data/accountData'
import { settings1 } from '../../../../tests/unit/data/settingsData'
import { defaultAccount, setAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { getSellOfferDraft } from '../helpers/getSellOfferDraft'
import { useOfferDetailsSetup } from './useOfferDetailsSetup'
import { useHeaderState } from '../../../components/header/store'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'

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
  const sellAmount = 1
  const meansOfPayment = {}
  const premium = 1.5
  const offerDraft = getSellOfferDraft({
    sellAmount,
    meansOfPayment,
    premium,
  })
  const setOfferDraftMock = jest.fn()
  const initialProps = {
    offerDraft,
    setOfferDraft: setOfferDraftMock,
  }
  afterEach(async () => {
    jest.clearAllMocks()
  })

  it('should return default values', async () => {
    await setAccount(defaultAccount)
    const { result } = renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })

    expect(result.current.paymentData).toEqual([])
    expect(result.current.isEditing).toEqual(false)
    expect(result.current.setMeansOfPayment).toEqual(setMeansOfPaymentMock)
    expect(result.current.toggleIsEditing).toBeInstanceOf(Function)
    expect(result.current.isStepValid).toEqual(false)
  })
  it('should return default values with existing payment data', async () => {
    await setAccount(fakeAccount)
    const { result } = renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })

    expect(result.current.paymentData).toEqual(fakeAccount.paymentData)
  })

  it('should add the correct header', async () => {
    await setAccount(defaultAccount)
    renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })

    expect(useHeaderState.getState().title).toBe(i18n('paymentMethods.title'))
    expect(useHeaderState.getState().icons?.[0].id).toBe('helpCircle')
    expect(useHeaderState.getState().icons?.[0].onPress).toEqual(showHelpMock)
  })
  it('should add correct header for account with payment data', async () => {
    await setAccount(fakeAccount)
    const { result } = renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })

    expect(useHeaderState.getState().title).toBe(i18n('paymentMethods.title'))
    expect(useHeaderState.getState().icons?.[0].id).toBe('edit3')
    expect(useHeaderState.getState().icons?.[0].onPress).toEqual(result.current.toggleIsEditing)
  })
  it('should add the correct while editing header', async () => {
    await setAccount(fakeAccount)
    const { result } = renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })

    act(() => {
      result.current.toggleIsEditing()
    })
    expect(result.current.isEditing).toBeTruthy()
    expect(useHeaderState.getState().title).toBe(i18n('paymentMethods.edit.title'))
    expect(useHeaderState.getState().icons?.[0].onPress).toEqual(result.current.toggleIsEditing)
    expect(useHeaderState.getState().icons?.[1].id).toBe('helpCircle')
    expect(useHeaderState.getState().icons?.[1].onPress).toEqual(showHelpMock)
  })
  it('should update offer draft on init', async () => {
    await setAccount(defaultAccount)
    renderHook(useOfferDetailsSetup, { wrapper: NavigationWrapper, initialProps })

    expect(setOfferDraftMock).toHaveBeenCalled()
  })
})
