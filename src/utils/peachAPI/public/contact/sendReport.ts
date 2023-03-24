import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type SendReportProps = RequestProps & {
  email: string
  reason: string
  topic: string
  message: string
}

/**
 * @description Method send report
 * @returns APISuccess
 */
export const sendReport = async ({
  email,
  reason,
  topic,
  message,
  timeout,
}: SendReportProps): Promise<[APISuccess | null, APIError | null]> => {
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

  return await parseResponse<APISuccess>(response, 'sendReport')
}
