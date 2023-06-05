import { renderHook } from '@testing-library/react-native'
import { contract } from '../../../../tests/unit/data/contractData'
import { usePopupStore } from '../../../store/usePopupStore'
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
    const { result } = renderHook(useDisputeRaisedNotice)
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
    const { result } = renderHook(useDisputeRaisedNotice)
    const disputePopupActions = result.current.showDisputeRaisedNotice(noPaymentContract, 'seller')

    expect(usePopupStore.getState()).toStrictEqual(
      expect.objectContaining({
        action1: {
          callback: disputePopupActions.submitAndClose,
          icon: 'arrowRightCircle',
          label: i18n('send'),
        },
        content: (
          <DisputeRaisedNotice
            contract={noPaymentContract}
            disputeReason={disputeReason}
            email={result.current.email}
            setEmail={result.current.setEmail}
            view="seller"
            action1={{
              callback: expect.any(Function),
              icon: 'arrowRightCircle',
              label: 'send',
            }}
            action2={undefined}
          />
        ),
        level: 'WARN',
        title: 'dispute opened',
        visible: true,
      }),
    )
  })
  it('opens dispute raised popup for seller without email required', () => {
    const { result } = renderHook(useDisputeRaisedNotice)
    const disputePopupActions = result.current.showDisputeRaisedNotice(contract, 'seller')

    expect(usePopupStore.getState()).toStrictEqual(
      expect.objectContaining({
        action1: {
          callback: disputePopupActions.submitAndGoToChat,
          icon: 'messageCircle',
          label: i18n('goToChat'),
        },
        action2: {
          callback: disputePopupActions.submitAndClose,
          icon: 'xSquare',
          label: i18n('close'),
        },
        content: (
          <DisputeRaisedNotice
            contract={contract}
            disputeReason="other"
            email={result.current.email}
            setEmail={result.current.setEmail}
            view="seller"
            action1={{
              callback: expect.any(Function),
              icon: 'messageCircle',
              label: 'go to chat',
            }}
            action2={{
              callback: expect.any(Function),
              icon: 'xSquare',
              label: 'close',
            }}
          />
        ),
        level: 'WARN',
        title: 'dispute opened',
        visible: true,
      }),
    )
  })
  it('popup action submits acknowledgement', async () => {
    const { result } = renderHook(useDisputeRaisedNotice)
    const disputePopupActions = result.current.showDisputeRaisedNotice(contract, 'seller')
    await disputePopupActions.submitAndClose()
    expect(submitDisputeAcknowledgementMock).toHaveBeenCalledWith({
      contractId: contract.id,
      disputeReason: 'other',
      email: '',
    })
  })
  it('popup action submits acknowledgement and goes to chat', async () => {
    const { result } = renderHook(useDisputeRaisedNotice)
    const disputePopupActions = result.current.showDisputeRaisedNotice(contract, 'seller')
    await disputePopupActions.submitAndGoToChat()
    expect(submitDisputeAcknowledgementMock).toHaveBeenCalledWith({
      contractId: contract.id,
      disputeReason: 'other',
      email: '',
    })
    expect(replaceMock).toHaveBeenCalledWith('contractChat', { contractId: contract.id })
  })
})
