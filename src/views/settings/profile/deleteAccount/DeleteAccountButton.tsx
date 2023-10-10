import { TouchableRedText } from '../../../../components/text/TouchableRedText'
import i18n from '../../../../utils/i18n'
import { useDeleteAccountPopups } from './useDeleteAccountPopups'

export const DeleteAccountButton = ({ style }: ComponentProps) => {
  const showDeleteAccountPopup = useDeleteAccountPopups()

  return (
    <TouchableRedText onPress={showDeleteAccountPopup} style={style} iconId="trash">
      {i18n('settings.deleteAccount')}
    </TouchableRedText>
  )
}
