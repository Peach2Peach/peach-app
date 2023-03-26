import { act, renderHook } from '@testing-library/react-native'
import { useOverlayContext } from '../../contexts/overlay'
import { SetCustomReferralCode } from './SetCustomReferralCode'
import { useSetCustomReferralCodeOverlay } from './useSetCustomReferralCodeOverlay'
import { redeemReferralCode } from '../../utils/peachAPI'
import { useNavigation } from '../../hooks/useNavigation'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { SetCustomReferralCodeSuccess } from './SetCustomReferralCodeSucess'
import i18n from '../../utils/i18n'

jest.mock('../../hooks/useNavigation', () => ({
  useNavigation: jest.fn(),
}))
jest.mock('../../contexts/overlay', () => ({
  useOverlayContext: jest.fn(),
}))
jest.mock('../../utils/peachAPI', () => ({
  redeemReferralCode: jest.fn(),
}))
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: jest.fn(),
}))

describe('useSetCustomReferralCodeOverlay', () => {
  const updateOverlayMock = jest.fn()
  ;(useOverlayContext as jest.Mock).mockReturnValue([{}, updateOverlayMock])
  ;(useNavigation as jest.Mock).mockReturnValue({
    replace: jest.fn(),
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('returns function to start setCustomReferralCodeOverlay', () => {
    const { result } = renderHook(useSetCustomReferralCodeOverlay)
    expect(result.current.setCustomReferralCodeOverlay).toBeInstanceOf(Function)
  })
  it('returns referral code state', () => {
    const { result } = renderHook(useSetCustomReferralCodeOverlay)
    const { referralCode, setReferralCode, referralCodeValid, referralCodeErrors } = result.current

    expect(referralCode).toBe('')
    expect(setReferralCode).toBeInstanceOf(Function)
    expect(referralCodeValid).toBeFalsy()
    expect(referralCodeErrors).toHaveLength(2)
  })
  it('opens overlay with correct default values', () => {
    const { result } = renderHook(useSetCustomReferralCodeOverlay)
    const { closeOverlay, submitCustomReferralCode, setReferralCode, referralCodeErrors } = result.current
    act(() => {
      result.current.setCustomReferralCodeOverlay()
    })

    expect(updateOverlayMock).toHaveBeenCalledWith(
      expect.objectContaining({
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
          callback: closeOverlay,
        }),
      }),
    )
  })
  it('can close overlay', () => {
    const { result } = renderHook(useSetCustomReferralCodeOverlay)
    act(() => {
      result.current.setCustomReferralCodeOverlay()
    })
    act(() => {
      result.current.closeOverlay()
    })

    expect(updateOverlayMock).toHaveBeenCalledWith(expect.objectContaining({ visible: false }))
  })
  it('updates referral code state', () => {
    const { result } = renderHook(useSetCustomReferralCodeOverlay)
    act(() => {
      result.current.setReferralCode('HODL')
    })

    expect(result.current.referralCode).toBe('HODL')
  })
  it('submits custom referral code', async () => {
    ;(redeemReferralCode as jest.Mock).mockResolvedValue([
      {
        success: true,
        bonusPoints: 0,
      },
      null,
    ])
    const { result } = renderHook(useSetCustomReferralCodeOverlay)
    act(() => {
      result.current.setReferralCode('HODL')
    })
    await act(async () => {
      await result.current.submitCustomReferralCode()
    })

    expect(redeemReferralCode).toHaveBeenCalledWith({ code: 'HODL' })
    expect(updateOverlayMock).toHaveBeenCalledWith({
      title: i18n('settings.referrals.customReferralCode.popup.title'),
      content: <SetCustomReferralCodeSuccess {...{ referralCode: 'HODL' }} />,
      level: 'APP',
      visible: true,
    })
    expect(useNavigation().replace).toHaveBeenCalledWith('referrals')
  })
  it('handles referral code exists error', async () => {
    ;(redeemReferralCode as jest.Mock).mockResolvedValue([
      null,
      {
        error: 'ALREADY_TAKEN',
      },
    ])
    const { result } = renderHook(useSetCustomReferralCodeOverlay)
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
    ;(redeemReferralCode as jest.Mock).mockResolvedValue([
      null,
      {
        error: 'NOT_ENOUGH_POINTS',
      },
    ])
    ;(useShowErrorBanner as jest.Mock).mockReturnValue(jest.fn())

    const { result } = renderHook(useSetCustomReferralCodeOverlay)
    expect(result.current.referralCodeErrors).toHaveLength(2)
    act(() => {
      result.current.setReferralCode('HODL')
    })

    await act(async () => {
      await result.current.submitCustomReferralCode()
    })

    expect(result.current.referralCodeErrors).toHaveLength(0)
    expect(useShowErrorBanner()).toHaveBeenCalledWith('NOT_ENOUGH_POINTS')
  })
})
