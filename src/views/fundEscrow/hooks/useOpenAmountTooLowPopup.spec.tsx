import { renderHook } from 'test-utils'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { ClosePopupAction } from '../../../popups/actions'
import { usePopupStore } from '../../../store/usePopupStore'
import { AmountTooLow } from '../components/AmountTooLow'
import { useOpenAmountTooLowPopup } from './useOpenAmountTooLowPopup'

describe('useOpenAmountTooLowPopup', () => {
  const available = 100
  const needed = 50000

  it('should open amount too low popup', () => {
    const { result } = renderHook(useOpenAmountTooLowPopup)

    result.current(available, needed)
    expect(usePopupStore.getState().visible).toBe(true)
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title="amount too low"
        content={<AmountTooLow available={available} needed={needed} />}
        actions={<ClosePopupAction style={{ justifyContent: 'center' }} />}
      />,
    )
  })
})
