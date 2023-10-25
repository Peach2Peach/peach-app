import { renderHook } from 'test-utils'
import { usePopupStore } from '../../../store/usePopupStore'
import { AmountTooLow } from '../components/AmountTooLow'
import { useOpenAmountTooLowPopup } from './useOpenAmountTooLowPopup'

describe('useOpenAmountTooLowPopup', () => {
  const available = 100
  const needed = 50000

  it('should open amount too low popup', () => {
    const { result } = renderHook(useOpenAmountTooLowPopup)

    result.current(available, needed)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'amount too low',
      level: 'APP',
      content: <AmountTooLow available={available} needed={needed} />,
    })
  })
})
