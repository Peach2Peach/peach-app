import { useContext } from 'react'
import { Text } from '../..'
import { DrawerContext } from '../../../contexts/drawer'
import tw from '../../../styles/tailwind'

export const DrawerTitle = () => {
  const [{ title }] = useContext(DrawerContext)
  return <Text style={tw`text-center drawer-title`}>{title}</Text>
}
