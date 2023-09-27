import { sendErrors } from '../../../utils/analytics'
import { peachAPI } from '../../../utils/peachAPI'
import { buildReportMessage } from './buildReportMessage'
import { submitReport } from './submitReport'

jest.mock('./buildReportMessage', () => ({
  buildReportMessage: jest.fn().mockReturnValue('reportMessage'),
}))
jest.mock('../../../utils/analytics', () => ({
  sendErrors: jest.fn(),
}))
jest.mock('../../../utils/peachAPI', () => ({
  sendReport: jest.fn().mockResolvedValue(['success', null]),
}))

describe('submitReport', () => {
  const email = 'adam@back.space'
  const reason = 'Feature request'
  const topic = 'I have an idea'
  const message = 'it will blow your socks off!'

  it('returns a message for report', async () => {
    const result = await submitReport({ email, reason, topic, message, shareDeviceID: false, shareLogs: false })
    expect(buildReportMessage).toHaveBeenCalledWith({ message, shareDeviceID: false, shareLogs: false })
    expect(peachAPI.public.contact.sendReport).toHaveBeenCalledWith({
      email,
      reason,
      topic,
      message: 'reportMessage',
    })
    expect(result).toEqual(['success', null])
  })
  it('does not send error report if logs are not intended to be shared', async () => {
    await submitReport({ email, reason, topic, message, shareDeviceID: false, shareLogs: false })
    expect(sendErrors).not.toHaveBeenCalled()
  })
  it('does  send error report if logs are intended to be shared', async () => {
    await submitReport({ email, reason, topic, message, shareDeviceID: false, shareLogs: true })
    expect(sendErrors).toHaveBeenCalledWith([new Error(`user shared app logs: ${topic} - reportMessage`)])
  })
})
