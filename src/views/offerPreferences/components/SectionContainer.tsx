import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { sectionContainerGap } from '../SellOfferPreferences'

export function SectionContainer ({ children, style }: { children: React.ReactNode; style?: View['props']['style'] }) {
  return <View style={[tw`items-center w-full p-3 rounded-2xl`, { gap: sectionContainerGap }, style]}>{children}</View>
}
