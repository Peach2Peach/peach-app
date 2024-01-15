import { renderHook, responseUtils, waitFor } from 'test-utils'
import { defaultUser } from '../../../../peach-api/src/testData/user'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { defaultState, useMessageState } from '../../../components/toast/useMessageState'
import { placeholderFees } from '../../../hooks/query/useFeeEstimate'
import { peachAPI } from '../../../utils/peachAPI'
import { useShowLowFeeWarning } from './useShowLowFeeWarning'

const getSelfUserMock = jest
  .spyOn(peachAPI.private.user, 'getSelfUser')
  .mockResolvedValue({ ...responseUtils, result: { ...defaultUser, feeRate: 0.99 } })
jest.spyOn(peachAPI.public.bitcoin, 'getFeeEstimate').mockResolvedValue({ result: placeholderFees, ...responseUtils })

jest.useFakeTimers()

describe('useShowLowFeeWarning', () => {
  const initialProps = { enabled: true }

  beforeEach(() => {
    useMessageState.setState(defaultState)
  })
  afterEach(() => {
    queryClient.clear()
  })
  it('should show high fee warning banner if fees are bigger than 10%', async () => {
    renderHook(useShowLowFeeWarning, { initialProps })
    await waitFor(() => {
      expect(useMessageState.getState()).toEqual(
        expect.objectContaining({
          action: {
            callback: expect.any(Function),
            icon: 'settings',
            label: 'change fee',
          },
          bodyArgs: ['1'],
          level: 'WARN',
          msgKey: 'contract.warning.lowFee',
        }),
      )
    })
  })
  it('should navigate to fee settings', () => {
    renderHook(useShowLowFeeWarning, { initialProps })
    useMessageState.getState().action?.callback()
    expect(navigateMock).toHaveBeenCalledWith('networkFees')
  })
  it('should not show high fee warning banner if disabled', () => {
    renderHook(useShowLowFeeWarning, {
      initialProps: { enabled: false },
    })
    expect(useMessageState.getState()).toEqual(expect.objectContaining(defaultState))
  })
  it('should not show high fee warning banner if fees are higher than minimum', async () => {
    getSelfUserMock.mockResolvedValueOnce({ result: { ...defaultUser, feeRate: 2 }, ...responseUtils })
    renderHook(useShowLowFeeWarning, { initialProps })
    await waitFor(() => {
      expect(queryClient.getQueryData(['user', 'self'])).toStrictEqual({
        ...defaultUser,
        feeRate: 2,
      })
    })
    expect(useMessageState.getState()).toEqual(expect.objectContaining(defaultState))
  })
})
