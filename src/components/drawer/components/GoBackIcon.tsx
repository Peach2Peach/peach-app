import { TouchableOpacity } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Icon } from '../..'
import tw from '../../../styles/tailwind'
import { useDrawerState } from '../useDrawerState'

export const GoBackIcon = () => {
  const [previousDrawer, updateDrawer] = useDrawerState((state) => [state.previousDrawer, state.updateDrawer], shallow)
  const goBack = () => {
    if (previousDrawer) {
      updateDrawer(previousDrawer)
    }
  }

  return (
    <TouchableOpacity onPress={goBack} disabled={!previousDrawer} style={!previousDrawer && tw`opacity-0`}>
      <Icon id="chevronLeft" size={24} color={tw`text-black-4`.color} />
    </TouchableOpacity>
  )
}
