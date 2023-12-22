import { TouchableOpacity } from 'react-native'
import tw from '../../../styles/tailwind'
import { Icon } from '../../Icon'

type Props = {
  closeDrawer: () => void
}

export const CloseIcon = ({ closeDrawer }: Props) => (
  <TouchableOpacity onPress={closeDrawer}>
    <Icon id="xSquare" style={tw`w-6 h-6`} color={tw.color('black-50')} />
  </TouchableOpacity>
)
