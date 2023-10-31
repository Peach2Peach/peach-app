import { act, renderHook } from 'test-utils'
import { replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { usePopupStore } from '../../store/usePopupStore'
import i18n from '../../utils/i18n'
import { SetCustomReferralCode } from './SetCustomReferralCode'
import { SetCustomReferralCodeSuccess } from './SetCustomReferralCodeSuccess'
import { useSetCustomReferralCodePopup } from './useSetCustomReferralCodePopup'

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
    expect(result.current.setCustomReferralCodePopup).toBeInstanceOf(Function)
  })
  it('returns referral code state', () => {
    const { result } = renderHook(useSetCustomReferralCodePopup)
    const { referralCode, setReferralCode, referralCodeValid, referralCodeErrors } = result.current

    expect(referralCode).toBe('')
    expect(setReferralCode).toBeInstanceOf(Function)
    expect(referralCodeValid).toBeFalsy()
    expect(referralCodeErrors).toHaveLength(2)
  })
  it('opens popup with correct default values', () => {
    const { result } = renderHook(useSetCustomReferralCodePopup)
    const { submitCustomReferralCode, setReferralCode, referralCodeErrors } = result.current
    act(() => {
      result.current.setCustomReferralCodePopup()
    })

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: i18n('settings.referrals.customReferralCode.popup.title'),
      content: <SetCustomReferralCode {...{ referralCode: '', setReferralCode, referralCodeErrors }} />,
      level: 'APP',
      visible: true,
      action1: expect.objectContaining({
        label: i18n('settings.referrals.customReferralCode.popup.redeem'),
        icon: 'checkSquare',
        callback: submitCustomReferralCode,
        disabled: true,
      }),
      action2: expect.objectContaining({
        label: i18n('close'),
        icon: 'xSquare',
        callback: expect.any(Function),
      }),
    })
  })
  it('can close popup', () => {
    const { result } = renderHook(useSetCustomReferralCodePopup)
    act(() => {
      result.current.setCustomReferralCodePopup()
    })

    usePopupStore.getState().action2?.callback()

    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('updates referral code state', () => {
    const { result } = renderHook(useSetCustomReferralCodePopup)
    act(() => {
      result.current.setReferralCode('HODL')
    })

    expect(result.current.referralCode).toBe('HODL')
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
      result.current.setReferralCode('HODL')
    })
    await act(async () => {
      await result.current.submitCustomReferralCode()
    })

    expect(redeemReferralCodeMock).toHaveBeenCalledWith({ code: 'HODL' })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: i18n('settings.referrals.customReferralCode.popup.title'),
      content: <SetCustomReferralCodeSuccess {...{ referralCode: 'HODL' }} />,
      level: 'APP',
      visible: true,
    })
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
    expect(result.current.referralCodeErrors).toHaveLength(2)
    act(() => {
      result.current.setReferralCode('HODL')
    })
    expect(result.current.referralCodeErrors).toHaveLength(0)

    await act(async () => {
      await result.current.submitCustomReferralCode()
    })

    expect(result.current.referralCodeErrors).toHaveLength(1)
  })
  it('handles other API Errors', async () => {
    redeemReferralCodeMock.mockResolvedValueOnce([
      null,
      {
        error: 'NOT_ENOUGH_POINTS',
      },
    ])

    const { result } = renderHook(useSetCustomReferralCodePopup)
    expect(result.current.referralCodeErrors).toHaveLength(2)
    act(() => {
      result.current.setReferralCode('HODL')
    })

    await act(async () => {
      await result.current.submitCustomReferralCode()
    })

    expect(result.current.referralCodeErrors).toHaveLength(0)
    expect(showErrorBannerMock).toHaveBeenCalledWith('NOT_ENOUGH_POINTS')
  })
})
