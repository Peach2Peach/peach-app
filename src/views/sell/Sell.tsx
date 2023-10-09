import { View } from 'react-native'
import { Header, Screen } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import { useNavigation, useShowHelp } from '../../hooks'
import { useConfigStore } from '../../store/configStore'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { BackupReminderIcon } from '../buy/BackupReminderIcon'
import { LoadingScreen } from '../loading/LoadingScreen'
import { SellAmountSelector } from './SellAmountSelector'
import { SellTitleComponent } from './components'
import { FundMultipleOffers } from './components/FundMultipleOffers'

export const Sell = () => {
  const navigation = useNavigation()
  const isAmountValid = useOfferPreferences((state) => state.canContinue.sellAmount)
  const isLoading = useConfigStore((state) => state.minTradingAmount === 0)
  const next = () => navigation.navigate('premium')

  const showBackupReminder = useSettingsStore((state) => state.showBackupReminder)

  if (isLoading) return <LoadingScreen />

  return (
    <Screen header={<SellHeader />} showFooter showTradingLimit>
      <SellAmountSelector style={tw`pt-4 pb-2`}>
        <FundMultipleOffers />
      </SellAmountSelector>
      <View style={[tw`flex-row items-center justify-center pt-4 pb-1`, tw.md`pb-4`]}>
        <Button disabled={!isAmountValid} onPress={next}>
          {i18n('next')}
        </Button>
        {showBackupReminder && <BackupReminderIcon />}
      </View>
    </Screen>
  )
}

function SellHeader () {
  const showHelp = useShowHelp('sellingBitcoin')
  return (
    <Header
      titleComponent={<SellTitleComponent />}
      icons={[{ ...headerIcons.help, onPress: showHelp }]}
      hideGoBackButton
      showPriceStats
    />
  )
}
