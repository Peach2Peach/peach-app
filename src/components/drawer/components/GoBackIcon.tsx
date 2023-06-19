import { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from '../..'
import { DrawerContext } from '../../../contexts/drawer'
import tw from '../../../styles/tailwind'

export const GoBackIcon = () => {
  const [{ previousDrawer }, updateDrawer] = useContext(DrawerContext)
  const goBack = () => {
    updateDrawer(previousDrawer)
  }

  return (
    <TouchableOpacity
      onPress={goBack}
      disabled={!Object.keys(previousDrawer).length}
      style={!Object.keys(previousDrawer).length && tw`opacity-0`}
    >
      <Icon id="chevronLeft" style={tw`w-6 h-6`} color={tw`text-black-4`.color} />
    </TouchableOpacity>
  )
}
