import { sendErrors } from '../../../utils/analytics'
import { sendReport } from '../../../utils/peachAPI'
import { buildReportMessage } from './buildReportMessage'

type Props = {
  email: string
  reason: string
  topic: string
  message: string
  shareDeviceID: boolean
  shareLogs: boolean
}

export const submitReport = async ({ email, reason, topic, message, shareDeviceID, shareLogs }: Props) => {
  const messageToSend = buildReportMessage({ message, shareDeviceID, shareLogs })
  if (shareLogs) {
    sendErrors([new Error(`user shared app logs: ${topic} - ${messageToSend}`)])
  }

  return await sendReport({
    email,
    reason,
    topic,
    message: messageToSend,
  })
}
