import { renderHook } from '@testing-library/react-hooks'
import { contract } from '../../../../tests/unit/data/contractData'
import i18n from '../../../utils/i18n'
import DisputeRaisedNotice from '../components/DisputeRaisedNotice'
import { useDisputeRaisedNotice } from './useDisputeRaisedNotice'

const navigateMock = jest.fn()
const replaceMock = jest.fn()
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: () => navigateMock(),
    replace: (...args: any[]) => replaceMock(...args),
  }),
}))

const updateOverlayMock = jest.fn()
const useOverlayContextMock = jest.fn().mockReturnValue([, updateOverlayMock])
jest.mock('../../../contexts/overlay', () => ({
  useOverlayContext: () => useOverlayContextMock(),
}))

const submitDisputeAcknowledgementMock = jest.fn()
const useSubmitDisputeAcknowledgementMock = jest.fn().mockReturnValue(submitDisputeAcknowledgementMock)
jest.mock('./helpers/useSubmitDisputeAcknowledgement', () => ({
  useSubmitDisputeAcknowledgement: () => useSubmitDisputeAcknowledgementMock(),
}))

describe('useDisputeRaisedNotice', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns interface', () => {
    const { result } = renderHook(() => useDisputeRaisedNotice())
    expect(result.current.showDisputeRaisedNotice).toBeInstanceOf(Function)
    expect(result.current.email).toBe('')
    expect(result.current.setEmail).toBeInstanceOf(Function)
    expect(result.current.emailErrors).toBeInstanceOf(Array)
  })

  it('opens dispute raised popup for seller with email required', () => {
    const disputeReason = 'noPayment.buyer'
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    }
    const { result } = renderHook(() => useDisputeRaisedNotice())
    const disputeOverlayActions = result.current.showDisputeRaisedNotice(noPaymentContract, 'seller')

    expect(updateOverlayMock).toHaveBeenCalledWith({
      action1: {
        callback: disputeOverlayActions.submitAndGoToContract,
        icon: 'arrowRightCircle',
        label: i18n('send'),
      },
      content: (
        <DisputeRaisedNotice
          contract={noPaymentContract}
          disputeReason={disputeReason}
          email={result.current.email}
          emailErrors={result.current.emailErrors}
          setEmail={result.current.setEmail}
          submit={submitDisputeAcknowledgementMock}
          view="seller"
        />
      ),
      level: 'WARN',
      title: 'dispute opened',
      visible: true,
    })
  })
  it('opens dispute raised popup for seller without email required', () => {
    const { result } = renderHook(() => useDisputeRaisedNotice())
    const disputeOverlayActions = result.current.showDisputeRaisedNotice(contract, 'seller')

    expect(updateOverlayMock).toHaveBeenCalledWith({
      action1: {
        callback: disputeOverlayActions.submitAndGoToChat,
        icon: 'messageCircle',
        label: i18n('goToChat'),
      },
      action2: {
        callback: disputeOverlayActions.submitAndClose,
        icon: 'xSquare',
        label: i18n('close'),
      },
      content: (
        <DisputeRaisedNotice
          contract={contract}
          disputeReason="other"
          email={result.current.email}
          emailErrors={result.current.emailErrors}
          setEmail={result.current.setEmail}
          submit={submitDisputeAcknowledgementMock}
          view="seller"
        />
      ),
      level: 'WARN',
      title: 'dispute opened',
      visible: true,
    })
  })
  it('overlay action submits acknowledgement', async () => {
    const { result } = renderHook(() => useDisputeRaisedNotice())
    const disputeOverlayActions = result.current.showDisputeRaisedNotice(contract, 'seller')
    await disputeOverlayActions.submitAndClose()
    expect(submitDisputeAcknowledgementMock).toHaveBeenCalledWith(contract, 'other', '')
  })
  it('overlay action submits acknowledgement and goes to chat', async () => {
    const { result } = renderHook(() => useDisputeRaisedNotice())
    const disputeOverlayActions = result.current.showDisputeRaisedNotice(contract, 'seller')
    await disputeOverlayActions.submitAndGoToChat()
    expect(submitDisputeAcknowledgementMock).toHaveBeenCalledWith(contract, 'other', '')
    expect(replaceMock).toHaveBeenCalledWith('contractChat', { contractId: contract.id })
  })
  it('overlay action submits acknowledgement and goes to contract', async () => {
    const { result } = renderHook(() => useDisputeRaisedNotice())
    const disputeOverlayActions = result.current.showDisputeRaisedNotice(contract, 'seller')

    await disputeOverlayActions.submitAndGoToContract()
    expect(submitDisputeAcknowledgementMock).toHaveBeenCalledWith(contract, 'other', '')
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
  })
})
