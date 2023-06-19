import { createRenderer } from 'react-test-renderer/shallow'
import { Report } from './Report'
import { account } from '../../utils/account'

const useReportSetupMock = jest.fn().mockReturnValue({
  email: 'satoshi@gmx.com',
  setEmail: jest.fn(),
  isEmailValid: true,
  emailErrors: [],
  topic: 'topic',
  setTopic: jest.fn(),
  isTopicValid: true,
  topicErrors: [],
  message: 'a message',
  setMessage: jest.fn(),
  isMessageValid: true,
  messageErrors: [],
  account,
  shareDeviceID: false,
  toggleDeviceIDSharing: jest.fn(),
  shareLogs: true,
  toggleShareLogs: jest.fn(),
  submit: jest.fn(),
})
jest.mock('./hooks/useReportSetup', () => ({
  useReportSetup: () => useReportSetupMock(),
}))

describe('Report', () => {
  const shallowRenderer = createRenderer()
  it('should render correctly', () => {
    shallowRenderer.render(<Report />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
