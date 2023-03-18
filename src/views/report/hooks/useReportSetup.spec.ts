import { act, renderHook } from '@testing-library/react-hooks'
import { defaultAccount, setAccount } from '../../../utils/account'
import { useReportSetup } from './useReportSetup'

jest.mock('../../../hooks/useRoute', () => ({
  useRoute: jest.fn().mockReturnValue({
    params: {},
  }),
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
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('returns default values correctly', () => {
    const { result } = renderHook(useReportSetup)

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
})
