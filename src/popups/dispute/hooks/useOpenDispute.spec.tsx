import { fireEvent, render, renderHook } from 'test-utils'
import { contract } from '../../../../peach-api/src/testData/contract'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { Popup, PopupAction } from '../../../components/popup'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import { WarningPopup } from '../../WarningPopup'
import { ClosePopupAction } from '../../actions'
import { OpenDispute } from '../components/OpenDispute'
import { useOpenDispute } from './useOpenDispute'

describe('useOpenDispute', () => {
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })

  it('should show open dispute popup', () => {
    const { result } = renderHook(useOpenDispute, { initialProps: contract.id })
    result.current()
    expect(usePopupStore.getState().visible).toEqual(true)
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <WarningPopup
        title="open dispute"
        content={<OpenDispute />}
        actions={
          <>
            <PopupAction
              textStyle={tw`text-black-1`}
              label="open dispute"
              iconId="alertOctagon"
              onPress={expect.any(Function)}
            />
            <ClosePopupAction textStyle={tw`text-black-1`} reverseOrder />
          </>
        }
      />,
    )
  })
  it('should close popup', () => {
    const { result } = renderHook(useOpenDispute, { initialProps: contract.id })
    result.current()
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('close'))
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('should navigate to disputeReasonSelector', () => {
    const { result } = renderHook(useOpenDispute, { initialProps: contract.id })
    result.current()
    const { getAllByText } = render(<Popup />)
    fireEvent.press(getAllByText('open dispute')[1])
    expect(navigateMock).toHaveBeenCalledWith('disputeReasonSelector', { contractId: contract.id })
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
