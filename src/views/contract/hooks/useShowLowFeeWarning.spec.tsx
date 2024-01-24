import { fireEvent, render, renderHook, responseUtils, waitFor } from 'test-utils'
import { defaultUser } from '../../../../peach-api/src/testData/userData'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { Toast } from '../../../components/toast/Toast'
import { placeholderFees } from '../../../hooks/query/useFeeEstimate'
import i18n from '../../../utils/i18n'
import { peachAPI } from '../../../utils/peachAPI'
import { useShowLowFeeWarning } from './useShowLowFeeWarning'

const getSelfUserMock = jest
  .spyOn(peachAPI.private.user, 'getSelfUser')
  .mockResolvedValue({ ...responseUtils, result: { ...defaultUser, feeRate: 0.99 } })
jest.spyOn(peachAPI.public.bitcoin, 'getFeeEstimate').mockResolvedValue({ result: placeholderFees, ...responseUtils })

jest.useFakeTimers()

describe('useShowLowFeeWarning', () => {
  const initialProps = { enabled: true }

  afterEach(() => {
    queryClient.clear()
  })
  it('should show high fee warning banner if fees are bigger than 10%', async () => {
    const { queryByText } = render(<Toast />)
    renderHook(useShowLowFeeWarning, { initialProps })
    await waitFor(() => {
      expect(queryByText(i18n('contract.warning.lowFee.text', '1'))).toBeTruthy()
    })
  })
  it('should navigate to fee settings', () => {
    const { getByText } = render(<Toast />)
    renderHook(useShowLowFeeWarning, { initialProps })
    fireEvent.press(getByText('change fee'))
    expect(navigateMock).toHaveBeenCalledWith('networkFees')
  })
  it('should not show high fee warning banner if disabled', () => {
    const { queryByText } = render(<Toast />)
    renderHook(useShowLowFeeWarning, {
      initialProps: { enabled: false },
    })
    expect(queryByText(i18n('contract.warning.lowFee.text', '1'))).toBeFalsy()
  })
  it('should not show high fee warning banner if fees are higher than minimum', async () => {
    getSelfUserMock.mockResolvedValueOnce({ result: { ...defaultUser, feeRate: 2 }, ...responseUtils })
    const { queryByText } = render(<Toast />)
    renderHook(useShowLowFeeWarning, { initialProps })
    await waitFor(() => {
      expect(queryClient.getQueryData(['user', 'self'])).toStrictEqual({
        ...defaultUser,
        feeRate: 2,
      })
    })
    expect(queryByText(i18n('contract.warning.lowFee.text', '1'))).toBeFalsy()
  })
})
