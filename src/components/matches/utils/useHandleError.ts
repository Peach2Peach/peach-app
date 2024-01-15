import { useCallback } from 'react'
import i18n from '../../../utils/i18n'
import { error } from '../../../utils/log/error'
import { useSetToast } from '../../toast/Toast'

const levels: Record<string, 'WARN'> = {
  NOT_FOUND: 'WARN',
  CANNOT_DOUBLEMATCH: 'WARN',
}

export const useHandleError = () => {
  const setToast = useSetToast()

  const handleError = useCallback(
    (err: APIError | null) => {
      error('Error', err)
      if (err?.error) {
        const msgKey = err?.error === 'NOT_FOUND' ? 'OFFER_TAKEN' : err?.error
        setToast({
          msgKey: msgKey || i18n('error.general', ((err?.details as string[]) || []).join(', ')),
          level: levels[err?.error] || 'ERROR',
        })
      }
    },
    [setToast],
  )

  return handleError
}
