import { useCallback, useContext } from 'react'
import { MessageContext } from '../contexts/message'
import { useNavigation } from '.'
import i18n from '../utils/i18n'
import { parseError } from '../utils/system'
import { error } from '../utils/log'

export const useShowErrorBanner = () => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)

  const showErrorBanner = useCallback(
    (err?: Error | string | null) => {
      error('Error', err)
      updateMessage({
        msgKey: err ? parseError(err) : 'GENERAL_ERROR',
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
