import { Text } from '../..'
import tw from '../../../styles/tailwind'
import { useDrawerState } from '../useDrawerState'

export const DrawerTitle = () => {
  const title = useDrawerState((state) => state.title)
  return <Text style={tw`text-center drawer-title`}>{title}</Text>
}
