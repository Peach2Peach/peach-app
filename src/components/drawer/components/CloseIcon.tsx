import { TouchableOpacity } from 'react-native'
import { Icon } from '../..'
import tw from '../../../styles/tailwind'

type Props = {
  closeDrawer: () => void
}

export const CloseIcon = ({ closeDrawer }: Props) => (
  <TouchableOpacity onPress={closeDrawer}>
    <Icon id="xSquare" style={tw`w-6 h-6`} color={tw.color('black-3')} />
  </TouchableOpacity>
)
