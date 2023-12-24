import { fireEvent, render } from 'test-utils'
import { contract } from '../../../../peach-api/src/testData/contract'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { OpenDisputePopup } from './OpenDisputePopup'

const closePopupMock = jest.fn()
jest.mock('../../../components/popup/Popup', () => ({
  useClosePopup: () => closePopupMock,
}))

describe('OpenDisputePopup', () => {
  it('should close popup', () => {
    const { getByText } = render(<OpenDisputePopup contractId={contract.id} />)
    fireEvent.press(getByText('close'))
    expect(closePopupMock).toHaveBeenCalled()
  })
  it('should navigate to disputeReasonSelector', () => {
    const { getAllByText } = render(<OpenDisputePopup contractId={contract.id} />)
    fireEvent.press(getAllByText('open dispute')[1])
    expect(navigateMock).toHaveBeenCalledWith('disputeReasonSelector', { contractId: contract.id })
  })
})
