import i18n from '../../../utils/i18n'
import { error } from '../../../utils/log'

const Levels: Record<string, Level> = {
  NOT_FOUND: 'WARN',
  CANNOT_DOUBLEMATCH: 'WARN',
}

export const handleError = (err: APIError | null, updateMessage: (value: MessageState) => void) => {
  error('Error', err)
  if (err?.error) {
    const msgKey = err?.error === 'NOT_FOUND' ? 'OFFER_TAKEN' : err?.error
    updateMessage({
      msgKey: msgKey || i18n('error.general', ((err?.details as string[]) || []).join(', ')),
      level: Levels[err?.error] || 'ERROR',
    })
  }
}
