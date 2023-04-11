import { Text } from '../../../../components'
import i18n from '../../../../utils/i18n'

export const DeleteAccountPopup = ({ title }: { title: 'popup' | 'forRealsies' | 'success' }) => (
  <Text>{i18n(`settings.deleteAccount.${title}`)}</Text>
)
