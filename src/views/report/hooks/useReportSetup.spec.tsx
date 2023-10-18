/* eslint-disable max-lines-per-function */
import { act, renderHook } from 'test-utils'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { ReportSuccess } from '../../../popups/app/ReportSuccess'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { defaultAccount, setAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { submitReport } from '../helpers/submitReport'
import { useReportSetup } from './useReportSetup'

const useRouteMock = jest.fn().mockReturnValue({
  params: {
    reason: 'testReason',
  },
})
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

jest.mock('../helpers/submitReport', () => ({
  submitReport: jest.fn(),
}))

jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: jest.fn(),
}))

describe('useReportSetup', () => {
  const email = 'test@email.com'
  const topic = 'testTopic'
  const message = 'testMessage'
  const reportSuccessPopup = {
    content: <ReportSuccess />,
    level: 'APP',
    requireUserAction: false,
    title: 'report sent!',
    visible: true,
  }
  const fillAllFields = (current: ReturnType<typeof useReportSetup>) =>
    act(() => {
      current.setEmail(email)
      current.setTopic(topic)
      current.setMessage(message)
    })

  const actSubmit = (current: ReturnType<typeof useReportSetup>) =>
    act(async () => {
      await current.submit()
    })

  beforeAll(() => {
    setAccount(defaultAccount)
  })
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
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
    useRouteMock.mockReturnValueOnce({
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

    act(() => {
      result.current.setEmail(email)
    })

    expect(result.current.email).toEqual(email)
    expect(result.current.isEmailValid).toBeTruthy()
    expect(result.current.emailErrors).toHaveLength(0)
  })
  it('sets topic', () => {
    const { result } = renderHook(useReportSetup)

    act(() => {
      result.current.setTopic(topic)
    })

    expect(result.current.topic).toEqual(topic)
    expect(result.current.isTopicValid).toBeTruthy()
    expect(result.current.topicErrors).toHaveLength(0)
  })

  it('sets message', () => {
    const { result } = renderHook(useReportSetup)

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

  it('ensure all fields are valid before submitting report', async () => {
    (submitReport as jest.Mock).mockResolvedValueOnce(['success', null])
    const { result } = renderHook(useReportSetup)

    await actSubmit(result.current)
    expect(submitReport).not.toHaveBeenCalled()

    act(() => {
      result.current.setEmail(email)
    })
    await actSubmit(result.current)
    expect(submitReport).not.toHaveBeenCalled()

    act(() => {
      result.current.setTopic(topic)
    })
    await actSubmit(result.current)
    expect(submitReport).not.toHaveBeenCalled()

    act(() => {
      result.current.setMessage(message)
    })
    await actSubmit(result.current)
    expect(submitReport).toHaveBeenCalled()
  })

  it('submits report navigates to welcome on success for not logged in user', async () => {
    (submitReport as jest.Mock).mockResolvedValueOnce(['success', null])
    const { result } = renderHook(useReportSetup)

    await fillAllFields(result.current)
    await actSubmit(result.current)

    expect(submitReport).toHaveBeenCalledWith({
      email,
      reason: i18n('contact.reason.testReason'),
      topic,
      message,
      shareDeviceID: false,
      shareLogs: false,
    })
    expect(navigateMock).toHaveBeenCalledWith('welcome')
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      ...reportSuccessPopup,
    })
  })
  it('submits report navigates to settings on success for logged in user', async () => {
    (submitReport as jest.Mock).mockResolvedValueOnce(['success', null])
    setAccount({ ...defaultAccount, publicKey: 'somepublickey' })

    const { result } = renderHook(useReportSetup)

    await fillAllFields(result.current)
    await actSubmit(result.current)

    expect(submitReport).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('settings')
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      ...reportSuccessPopup,
    })
  })
  it('shows error banner if report could not be submitted', async () => {
    (submitReport as jest.Mock).mockResolvedValueOnce([null, 'error'])
    ;(useShowErrorBanner as jest.Mock).mockReturnValue(jest.fn())
    setAccount({ ...defaultAccount, publicKey: 'somepublickey' })

    const { result } = renderHook(useReportSetup)

    await fillAllFields(result.current)
    await actSubmit(result.current)

    expect(navigateMock).not.toHaveBeenCalledWith()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      ...defaultPopupState,
    })
    expect(useShowErrorBanner()).toHaveBeenCalled()
  })
})
