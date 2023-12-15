import { View } from 'react-native'
import { PeachText } from '../../../components/text/PeachText'
import tw from '../../../styles/tailwind'

export const sectionContainerPadding = 12
export const sectionContainerGap = 10

function Container ({ children, style }: { children: React.ReactNode; style?: View['props']['style'] }) {
  return (
    <View
      style={[
        tw`items-center w-full rounded-2xl`,
        { gap: sectionContainerGap, padding: sectionContainerPadding },
        style,
      ]}
    >
      {children}
    </View>
  )
}

const Section = {
  Container,
  Title: ({ children }: { children: React.ReactNode }) => <PeachText style={tw`subtitle-1`}>{children}</PeachText>,
}

export { Section }
