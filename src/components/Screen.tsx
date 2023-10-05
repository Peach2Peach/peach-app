import { SafeAreaView, View, ViewProps } from 'react-native'
import tw from '../styles/tailwind'
import { DailyTradingLimit } from '../views/settings/profile/DailyTradingLimit'
import { Footer } from './footer'

type Props = {
  style?: ViewProps['style']
  header?: React.ReactNode
  showFooter?: boolean
  showTradingLimit?: boolean
  children: React.ReactNode
}

export const Screen = ({ children, header, showFooter = false, showTradingLimit = false, style }: Props) => (
  <View style={tw`flex-1`}>
    {header}
    <SafeAreaView style={tw`flex-1`}>
      <View style={[tw`flex-1 p-sm`, tw.md`p-md`, style]}>{children}</View>
      {showTradingLimit && <DailyTradingLimit />}
      {showFooter && <Footer />}
    </SafeAreaView>
  </View>
)
