import { TouchableOpacity } from 'react-native'
import { Icon, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { useDeleteAccountPopups } from './useDeleteAccountPopups'

export const DeleteAccountButton = ({ style }: ComponentProps) => {
  const showDeleteAccountOverlay = useDeleteAccountPopups()

  return (
    <TouchableOpacity style={[tw`flex-row items-center`, style]} onPress={showDeleteAccountOverlay}>
      <Text style={tw`subtitle-1 text-error-main`}>{i18n('settings.deleteAccount')}</Text>
      <Icon id="trash" color={tw`text-error-main`.color} style={tw`w-4 h-4 ml-4`} />
    </TouchableOpacity>
  )
}
