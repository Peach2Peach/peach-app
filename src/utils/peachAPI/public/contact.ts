import { API_URL } from '@env'
import { RequestProps } from '..'
import fetch, { getAbortSignal } from '../../fetch'
import { parseResponse } from '../parseResponse'

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
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email,
      reason,
      topic,
      message,
    }),
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<APISuccess>(response, 'sendReport')
}
