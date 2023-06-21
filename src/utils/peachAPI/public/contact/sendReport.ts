import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type SendReportProps = RequestProps & {
  email: string
  reason: string
  topic: string
  message: string
}

export const sendReport = async ({ email, reason, topic, message, timeout }: SendReportProps) => {
  const response = await fetch(`${API_URL}/v1/contact/report`, {
    headers: getPublicHeaders(),
    method: 'POST',
    body: JSON.stringify({
      email,
      reason,
      topic,
      message,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'sendReport')
}
