import Clipboard from '@react-native-clipboard/clipboard'
import { Bubble } from '../../../../../components/bubble'
import { usePublicProfileNavigation } from '../../../../../hooks'
import tw from '../../../../../styles/tailwind'

type Props = { id: string; isDispute?: boolean; showInfo?: boolean } & ComponentProps

export const UserId = ({ id, isDispute = false, showInfo = false, style }: Props) => {
  const peachId = `Peach${id.slice(0, 8)}`
  const goToUserProfile = usePublicProfileNavigation(id)
  const copy = () => Clipboard.setString(peachId)

  return (
    <Bubble
      style={style}
      color="primary-mild"
      iconSize={12}
      iconId={showInfo ? 'info' : 'copy'}
      iconColor={isDispute ? tw`text-error-main` : undefined}
      onPress={showInfo ? goToUserProfile : copy}
    >
      {peachId}
    </Bubble>
  )
}
