import { PeachText } from '../../../../components/text/PeachText'
import i18n from '../../../../utils/i18n'

export const DeleteAccountPopup = ({ title }: { title: 'popup' | 'forRealsies' | 'success' }) => (
  <PeachText>{i18n(`settings.deleteAccount.${title}`)}</PeachText>
)
