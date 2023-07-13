import { Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'
import { useKeyboard } from '../../hooks'
import tw from '../../styles/tailwind'
import { FooterItem } from './FooterItem'
import { footerThemes } from './footerThemes'
import { useFooterSetup } from './hooks/useFooterSetup'

type Props = ComponentProps & {
  currentPage: keyof RootStackParamList
  setCurrentPage: Dispatch<SetStateAction<keyof RootStackParamList | undefined>>
  theme?: 'default' | 'inverted'
}

const isSettings
  = /settings|contact|report|language|currency|backup|paymentMethods|deleteAccount|fees|socials|seedWords/u
const isWallet = /wallet|transactionHistory|transactionDetails/u
const isBuy = /buy|buyPreferences|home/u
const isSell = /sell|premium|sellPreferences/u

export const Footer = ({ currentPage, style, setCurrentPage, theme = 'default' }: Props) => {
  const { navigate, notifications } = useFooterSetup({ setCurrentPage })
  const keyboardOpen = useKeyboard()
  const colors = footerThemes[theme]

  if (keyboardOpen) return <View />

  return (
    <View style={[tw`flex-row items-start w-full`, style]}>
      <View style={tw`relative flex-grow`}>
        <View style={[tw`flex-row items-center justify-between px-2 py-4`, colors.bg]}>
          <FooterItem theme={theme} id="buy" active={isBuy.test(currentPage)} onPress={navigate.buy} />
          <FooterItem theme={theme} id="sell" active={isSell.test(currentPage)} onPress={navigate.sell} />
          <FooterItem theme={theme} id="wallet" active={isWallet.test(currentPage)} onPress={navigate.wallet} />
          <FooterItem
            theme={theme}
            id="yourTrades"
            active={currentPage === 'yourTrades' || /contract/u.test(currentPage)}
            onPress={navigate.yourTrades}
            notifications={notifications}
          />
          <FooterItem theme={theme} id="settings" active={isSettings.test(currentPage)} onPress={navigate.settings} />
        </View>
      </View>
    </View>
  )
}
