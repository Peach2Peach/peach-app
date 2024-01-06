import { useCallback } from 'react'
import i18n from '../../../utils/i18n'
import { error } from '../../../utils/log/error'
import { useMessageState } from '../../message/useMessageState'

const Levels: Record<string, Level> = {
  NOT_FOUND: 'WARN',
  CANNOT_DOUBLEMATCH: 'WARN',
}

export const useHandleError = () => {
  const updateMessage = useMessageState((state) => state.updateMessage)

  const handleError = useCallback(
    (err: APIError | null) => {
      error('Error', err)
      if (err?.error) {
        const msgKey = err?.error === 'NOT_FOUND' ? 'OFFER_TAKEN' : err?.error
        updateMessage({
          msgKey: msgKey || i18n('error.general', ((err?.details as string[]) || []).join(', ')),
          level: Levels[err?.error] || 'ERROR',
        })
      }
    },
    [updateMessage],
  )

  return handleError
}
