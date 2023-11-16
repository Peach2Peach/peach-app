import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { SafeAreaView, StatusBar, View, ViewProps } from 'react-native'
import tw from '../styles/tailwind'
import { peachyGradient } from '../utils/layout'
import { isAndroid } from '../utils/system'
import { DailyTradingLimit } from '../views/settings/profile/DailyTradingLimit'
import { PeachyBackground } from './PeachyBackground'
import { Footer } from './footer'
import { Header } from './header/Header'

type Props = {
  style?: ViewProps['style']
  header?: React.ReactNode | string
  showFooter?: boolean
  showTradingLimit?: boolean
  gradientBackground?: boolean
  children: React.ReactNode
}

export const Screen = ({
  children,
  header,
  showFooter = false,
  showTradingLimit = false,
  gradientBackground = false,
  style,
}: Props) => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(gradientBackground ? 'light-content' : 'dark-content', true)
      if (isAndroid()) StatusBar.setBackgroundColor(
        gradientBackground ? peachyGradient[2].color : String(tw`text-primary-background`.color),
        true,
      )
    }, [gradientBackground]),
  )
  return (
    <View style={tw`flex-1`}>
      {gradientBackground && <PeachyBackground />}
      {typeof header === 'string' ? <Header title={header} /> : header}
      <SafeAreaView style={tw`flex-1`}>
        <View style={[tw`flex-1 p-sm`, tw.md`p-md`, style]}>{children}</View>
        {showTradingLimit && <DailyTradingLimit />}
        {showFooter && <Footer />}
      </SafeAreaView>
    </View>
  )
}
