import { fireEvent, render, renderHook, responseUtils, waitFor } from 'test-utils'
import { defaultUser } from '../../../../peach-api/src/testData/userData'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { Toast } from '../../../components/toast/Toast'
import i18n from '../../../utils/i18n'
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

  it('should show high fee warning banner if fees are bigger than 10%', async () => {
    const { queryByText } = render(<Toast />)
    renderHook(useShowHighFeeWarning, { initialProps })
    await waitFor(() => {
      expect(queryByText(i18n('contract.warning.highFee.text', '100', '10.0'))).toBeTruthy()
    })
  })
  it('should navigate to fee settings', () => {
    const { getByText } = render(<Toast />)
    renderHook(useShowHighFeeWarning, { initialProps })
    fireEvent.press(getByText('change fee'))
    expect(navigateMock).toHaveBeenCalledWith('networkFees')
  })
  it('should not show high fee warning banner if disabled', () => {
    const { queryByText } = render(<Toast />)
    renderHook(useShowHighFeeWarning, {
      initialProps: {
        enabled: false,
        amount: 100000,
      },
    })
    expect(queryByText(i18n('contract.warning.highFee', '100', '10.0'))).toBeFalsy()
  })
  it('should not show high fee warning banner if fees are lower than 10%', () => {
    const { queryByText } = render(<Toast />)
    renderHook(useShowHighFeeWarning, {
      initialProps: {
        enabled: true,
        amount: 173001,
      },
    })
    expect(queryByText(i18n('contract.warning.highFee', '100', '10.0'))).toBeFalsy()
  })
  it('should not show high fee warning banner if no amount is passed', () => {
    const { queryByText } = render(<Toast />)
    renderHook(useShowHighFeeWarning, {
      initialProps: {
        enabled: true,
        amount: undefined,
      },
    })
    expect(queryByText(i18n('contract.warning.highFee', '100', '10.0'))).toBeFalsy()
  })
})
