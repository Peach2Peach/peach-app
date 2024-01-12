import { renderHook, responseUtils, waitFor } from 'test-utils'
import { defaultUser } from '../../../../peach-api/src/testData/user'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { defaultState, useMessageState } from '../../../components/message/useMessageState'
import { peachAPI } from '../../../utils/peachAPI'
import { useShowHighFeeWarning } from './useShowHighFeeWarning'

jest.useFakeTimers()

jest
  .spyOn(peachAPI.private.user, 'getSelfUser')
  .mockResolvedValue({ result: { ...defaultUser, feeRate: 100 }, ...responseUtils })

describe('useShowHighFeeWarning', () => {
  const initialProps = {
    enabled: true,
    amount: 173000,
  }

  beforeEach(() => {
    useMessageState.setState(defaultState)
  })
  it('should show high fee warning banner if fees are bigger than 10%', async () => {
    renderHook(useShowHighFeeWarning, { initialProps })
    await waitFor(() => {
      expect(useMessageState.getState()).toEqual(
        expect.objectContaining({
          action: {
            callback: expect.any(Function),
            icon: 'settings',
            label: 'change fee',
          },
          bodyArgs: ['100', '10.0'],
          level: 'WARN',
          msgKey: 'contract.warning.highFee',
        }),
      )
    })
  })
  it('should navigate to fee settings', () => {
    renderHook(useShowHighFeeWarning, { initialProps })
    useMessageState.getState().action?.callback()
    expect(navigateMock).toHaveBeenCalledWith('networkFees')
  })
  it('should not show high fee warning banner if disabled', () => {
    renderHook(useShowHighFeeWarning, {
      initialProps: {
        enabled: false,
        amount: 100000,
      },
    })
    expect(useMessageState.getState()).toEqual(expect.objectContaining(defaultState))
  })
  it('should not show high fee warning banner if fees are lower than 10%', () => {
    renderHook(useShowHighFeeWarning, {
      initialProps: {
        enabled: true,
        amount: 173001,
      },
    })
    expect(useMessageState.getState()).toEqual(expect.objectContaining(defaultState))
  })
  it('should not show high fee warning banner if no amount is passed', () => {
    renderHook(useShowHighFeeWarning, {
      initialProps: {
        enabled: true,
        amount: undefined,
      },
    })
    expect(useMessageState.getState()).toEqual(expect.objectContaining(defaultState))
  })
})
