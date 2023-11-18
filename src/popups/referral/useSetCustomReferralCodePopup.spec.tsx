import { toMatchDiffSnapshot } from 'snapshot-diff'
import { act, fireEvent, render, renderHook } from 'test-utils'
import { replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { usePopupStore } from '../../store/usePopupStore'
import { useSetCustomReferralCodePopup } from './useSetCustomReferralCodePopup'
expect.extend({ toMatchDiffSnapshot })

const redeemReferralCodeMock = jest.fn().mockReturnValue(jest.fn())
jest.mock('../../utils/peachAPI', () => ({
  redeemReferralCode: (...args: unknown[]) => redeemReferralCodeMock(...args),
}))
const showErrorBannerMock = jest.fn()
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

describe('useSetCustomReferralCodePopup', () => {
  it('returns function to start setCustomReferralCodePopup', () => {
    const { result } = renderHook(useSetCustomReferralCodePopup)
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens popup with correct default values', () => {
    const { result } = renderHook(useSetCustomReferralCodePopup)
    act(() => {
      result.current()
    })

    const popup = usePopupStore.getState().popupComponent || <></>
    expect(render(popup)).toMatchSnapshot()
  })
  it('can close popup', () => {
    const { result } = renderHook(useSetCustomReferralCodePopup)
    act(() => {
      result.current()
    })

    const popup = usePopupStore.getState().popupComponent || <></>
    const { getByText } = render(popup)

    fireEvent.press(getByText('close'))
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('updates referral code state', () => {
    const { result } = renderHook(useSetCustomReferralCodePopup)
    act(() => {
      result.current()
    })

    const popup = usePopupStore.getState().popupComponent || <></>
    const { getByPlaceholderText, toJSON } = render(popup)

    const withoutText = toJSON()
    fireEvent.changeText(getByPlaceholderText('creative thing here'), 'HODL')
    const withText = toJSON()

    expect(withoutText).toMatchDiffSnapshot(withText)
  })
  it('submits custom referral code', async () => {
    redeemReferralCodeMock.mockResolvedValueOnce([
      {
        success: true,
        bonusPoints: 0,
      },
      null,
    ])
    const { result } = renderHook(useSetCustomReferralCodePopup)

    act(() => {
      result.current()
    })

    const popup = usePopupStore.getState().popupComponent || <></>
    const { getByText, getByPlaceholderText } = render(popup)

    fireEvent.changeText(getByPlaceholderText('creative thing here'), 'HODL')
    await fireEvent.press(getByText('set referral'))

    expect(redeemReferralCodeMock).toHaveBeenCalledWith({ code: 'HODL' })
    const newPopup = usePopupStore.getState().popupComponent || <></>
    expect(render(newPopup).toJSON()).toMatchSnapshot()
    expect(replaceMock).toHaveBeenCalledWith('referrals')
  })
  it('handles referral code exists error', async () => {
    redeemReferralCodeMock.mockResolvedValueOnce([
      null,
      {
        error: 'ALREADY_TAKEN',
      },
    ])

    const { result } = renderHook(useSetCustomReferralCodePopup)

    act(() => {
      result.current()
    })

    const popup = usePopupStore.getState().popupComponent || <></>
    const { getByText, getByPlaceholderText, toJSON } = render(popup)

    fireEvent.changeText(getByPlaceholderText('creative thing here'), 'HODL')
    const withoutError = toJSON()
    await act(async () => {
      await fireEvent.press(getByText('set referral'))
    })
    const withError = toJSON()

    expect(withoutError).toMatchDiffSnapshot(withError)
  })
  it('handles other API Errors', async () => {
    redeemReferralCodeMock.mockResolvedValueOnce([
      null,
      {
        error: 'NOT_ENOUGH_POINTS',
      },
    ])

    const { result } = renderHook(useSetCustomReferralCodePopup)

    act(() => {
      result.current()
    })

    const popup = usePopupStore.getState().popupComponent || <></>
    const { getByText, getByPlaceholderText } = render(popup)

    fireEvent.changeText(getByPlaceholderText('creative thing here'), 'HODL')
    await fireEvent.press(getByText('set referral'))

    expect(showErrorBannerMock).toHaveBeenCalledWith('NOT_ENOUGH_POINTS')
  })
})
