import { sendErrors } from '../../../utils/analytics/sendErrors'
import { peachAPI } from '../../../utils/peachAPI'
import { buildReportMessage } from './buildReportMessage'

type Props = {
  email: string
  reason: string
  topic: string
  message: string
  shareDeviceID: boolean
  shareLogs: boolean
}

export const submitReport = ({ email, reason, topic, message, shareDeviceID, shareLogs }: Props) => {
  const messageToSend = buildReportMessage({ message, shareDeviceID, shareLogs })
  if (shareLogs) {
    sendErrors([new Error(`user shared app logs: ${topic} - ${messageToSend}`)])
  }

  return peachAPI.public.contact.sendReport({
    email,
    reason,
    topic,
    message: messageToSend,
  })
}
