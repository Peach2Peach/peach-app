import { API_URL } from '@env'
import { parseResponse } from '..'
import fetch from '../../fetch'

type SendReportProps = {
  email: string,
  reason: ContactReason,
  topic: string,
  message: string,
}

/**
 * @description Method send report
 * @returns APISuccess
 */
export const sendReport = async ({
  email,
  reason,
  topic,
  message
}: SendReportProps): Promise<[APISuccess|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/contact/report`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      email, reason, topic, message
    })
  })

  return await parseResponse<APISuccess>(response, 'sendReport')
}
