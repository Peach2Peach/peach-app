import i18n from '../../../utils/i18n'
import { error } from '../../../utils/log'

const messageLevels: Record<string, Level> = {
  NOT_FOUND: 'WARN',
  CANNOT_DOUBLEMATCH: 'WARN',
}

export const handleError = (err: APIError | null, updateMessage: (value: MessageState) => void) => {
  error('Error', err)
  if (err?.error) {
    const msgKey = err?.error === 'NOT_FOUND' ? 'OFFER_TAKEN' : err?.error
    updateMessage({
      msgKey: msgKey || i18n('error.general', ((err?.details as string[]) || []).join(', ')),
      level: messageLevels[err?.error] || 'ERROR',
    })
  } /*
  Should this still exist?
  else {
    updateMessage({
      msgKey: i18n('GENERAL_ERROR', ((err?.details as string[]) || []).join(', ')),
      level: messageLevels[err?.error] || 'ERROR',
      action: () => navigation.navigate('contact', {}),
      actionLabel: i18n('contactUs'),
      actionIcon: 'mail',
    })
  } */
}
