import { SafeAreaView, View, ViewProps } from 'react-native'
import tw from '../styles/tailwind'
import { DailyTradingLimit } from '../views/settings/profile/DailyTradingLimit'
import { Footer } from './footer'
import { Header } from './header/Header'

type Props = {
  style?: ViewProps['style']
  header?: React.ReactNode | string
  showFooter?: boolean
  showTradingLimit?: boolean
  children: React.ReactNode
}

export const Screen = ({ children, header, showFooter = false, showTradingLimit = false, style }: Props) => (
  <View style={tw`flex-1`}>
    {typeof header === 'string' ? <Header title={header} /> : header}
    <SafeAreaView style={tw`flex-1`}>
      <View style={[tw`flex-1 p-sm`, tw.md`p-md`, style]}>{children}</View>
      {showTradingLimit && <DailyTradingLimit />}
      {showFooter && <Footer />}
    </SafeAreaView>
  </View>
)
