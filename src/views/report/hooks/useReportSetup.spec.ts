/* eslint-disable max-lines-per-function */
import { act, renderHook } from '@testing-library/react-hooks'
import { useRoute } from '../../../hooks'
import { defaultAccount, setAccount } from '../../../utils/account'
import { useReportSetup } from './useReportSetup'

jest.mock('../../../hooks/useRoute', () => ({
  useRoute: jest.fn(),
}))
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))
jest.mock('../../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: jest.fn(),
}))

describe('useReportSetup', () => {
  beforeAll(async () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        reason: 'testReason',
      },
    })
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('returns default values correctly', () => {
    const { result } = renderHook(useReportSetup)

    expect(result.current.reason).toEqual('testReason')
    expect(result.current.email).toEqual('')
    expect(result.current.setEmail).toBeDefined()
    expect(result.current.isEmailValid).toBeFalsy()
    expect(result.current.emailErrors).toHaveLength(2)
    expect(result.current.topic).toEqual('')
    expect(result.current.setTopic).toBeDefined()
    expect(result.current.isTopicValid).toBeFalsy()
    expect(result.current.topicErrors).toHaveLength(1)
    expect(result.current.message).toEqual('')
    expect(result.current.setMessage).toBeDefined()
    expect(result.current.isMessageValid).toBeFalsy()
    expect(result.current.messageErrors).toHaveLength(1)
    expect(result.current.account).toEqual(defaultAccount)
    expect(result.current.shareDeviceID).toBeFalsy()
    expect(result.current.toggleDeviceIDSharing).toBeDefined()
    expect(result.current.shareLogs).toBeFalsy()
    expect(result.current.toggleShareLogs).toBeDefined()
    expect(result.current.submit).toBeDefined()
  })

  it('respects route params', () => {
    ;(useRoute as jest.Mock).mockReturnValue({
      params: {
        reason: 'testReason',
        topic: 'testTopic',
        message: 'testMessage',
        shareDeviceID: true,
      },
    })
    const { result } = renderHook(useReportSetup)

    expect(result.current.reason).toEqual('testReason')
    expect(result.current.topic).toEqual('testTopic')
    expect(result.current.isTopicValid).toBeTruthy()
    expect(result.current.topicErrors).toHaveLength(0)
    expect(result.current.message).toEqual('testMessage')
    expect(result.current.isMessageValid).toBeTruthy()
    expect(result.current.messageErrors).toHaveLength(0)
    expect(result.current.shareDeviceID).toBeTruthy()
  })

  it('sets email', () => {
    const { result } = renderHook(useReportSetup)
    const email = 'test@email.com'

    act(() => {
      result.current.setEmail(email)
    })

    expect(result.current.email).toEqual(email)
    expect(result.current.isEmailValid).toBeTruthy()
    expect(result.current.emailErrors).toHaveLength(0)
  })
  it('sets topic', () => {
    const { result } = renderHook(useReportSetup)
    const topic = 'topic'

    act(() => {
      result.current.setTopic(topic)
    })

    expect(result.current.topic).toEqual(topic)
    expect(result.current.isTopicValid).toBeTruthy()
    expect(result.current.topicErrors).toHaveLength(0)
  })

  it('sets message', () => {
    const { result } = renderHook(useReportSetup)
    const message = 'message'

    act(() => {
      result.current.setMessage(message)
    })

    expect(result.current.message).toEqual(message)
    expect(result.current.isMessageValid).toBeTruthy()
    expect(result.current.messageErrors).toHaveLength(0)
  })

  it('toggles deviceIDSharing', () => {
    const { result } = renderHook(useReportSetup)

    expect(result.current.shareDeviceID).toBeFalsy()
    act(() => {
      result.current.toggleDeviceIDSharing()
    })
    expect(result.current.shareDeviceID).toBeTruthy()
  })

  it('toggles sharing logs', () => {
    const { result } = renderHook(useReportSetup)

    expect(result.current.shareLogs).toBeFalsy()
    act(() => {
      result.current.toggleShareLogs()
    })
    expect(result.current.shareLogs).toBeTruthy()
  })
})
