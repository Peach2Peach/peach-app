import { sendErrors } from '../../../utils/analytics/sendErrors'
import { peachAPI } from '../../../utils/peachAPI'
import { buildReportMessage } from './buildReportMessage'
import { submitReport } from './submitReport'

jest.mock('./buildReportMessage', () => ({
  buildReportMessage: jest.fn().mockReturnValue('reportMessage'),
}))
jest.mock('../../../utils/analytics/sendErrors', () => ({
  sendErrors: jest.fn(),
}))
const sendReportSpy = jest.spyOn(peachAPI.public.contact, 'sendReport')

describe('submitReport', () => {
  const email = 'adam@back.space'
  const reason = 'Feature request'
  const topic = 'I have an idea'
  const message = 'it will blow your socks off!'

  it('returns a message for report', async () => {
    const result = await submitReport({ email, reason, topic, message, shareDeviceID: false, shareLogs: false })
    expect(buildReportMessage).toHaveBeenCalledWith({ message, shareDeviceID: false, shareLogs: false })
    expect(sendReportSpy).toHaveBeenCalledWith({
      email,
      reason,
      topic,
      message: 'reportMessage',
    })
    expect(result.result?.success).toBe(true)
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
