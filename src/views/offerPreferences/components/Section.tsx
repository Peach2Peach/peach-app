import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { sectionContainerGap } from '../SellOfferPreferences'

function Container ({ children, style }: { children: React.ReactNode; style?: View['props']['style'] }) {
  return <View style={[tw`items-center w-full p-3 rounded-2xl`, { gap: sectionContainerGap }, style]}>{children}</View>
}

const Section = {
  Container,
  Title: ({ children }: { children: React.ReactNode }) => <Text style={tw`subtitle-1`}>{children}</Text>,
}

export { Section }
