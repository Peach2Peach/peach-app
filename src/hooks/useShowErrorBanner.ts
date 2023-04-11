import { useCallback, useContext } from 'react'
import { useNavigation } from '.'
import { MessageContext } from '../contexts/message'
import i18n from '../utils/i18n'
import { error } from '../utils/log'
import { parseError } from '../utils/result'

export const useShowErrorBanner = () => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)

  const showErrorBanner = useCallback(
    (err?: Error | string | null, bodyArgs?: string[]) => {
      error('Error', err)
      updateMessage({
        msgKey: err ? parseError(err) : 'GENERAL_ERROR',
        bodyArgs,
        level: 'ERROR',
        action: {
          callback: () => navigation.navigate('contact'),
          label: i18n('contactUs'),
          icon: 'mail',
        },
      })
    },
    [navigation, updateMessage],
  )

  return showErrorBanner
}
