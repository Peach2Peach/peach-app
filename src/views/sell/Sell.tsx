import { View } from 'react-native'
import { BitcoinPriceStats, HorizontalLine, PrimaryButton } from '../../components'
import { useNavigation } from '../../hooks'
import { useConfigStore } from '../../store/configStore'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import { useSettingsStore } from '../../store/useSettingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BackupReminderIcon } from '../buy/BackupReminderIcon'
import LoadingScreen from '../loading/LoadingScreen'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { useSellSetup } from './hooks/useSellSetup'
import { SellAmountSelector } from './SellAmountSelector'

export default () => {
  const navigation = useNavigation()
  useSellSetup({ help: 'sellingBitcoin', hideGoBackButton: true })

  const showBackupReminder = useSettingsStore((state) => state.showBackupReminder)
  const isAmountValid = useOfferPreferences((state) => state.canContinue.sellAmount)
  const minTradingAmount = useConfigStore((state) => state.minTradingAmount)

  const next = () => navigation.navigate('premium')

  return minTradingAmount === 0 ? (
    <LoadingScreen />
  ) : (
    <View style={tw`h-full`}>
      <HorizontalLine style={tw`mx-8`} />
      <View style={tw`px-8 mt-2`}>
        <BitcoinPriceStats />
      </View>
      <SellAmountSelector style={tw`mt-4 mb-2`} />
      <View style={[tw`flex-row items-center justify-center mt-4 mb-1`, tw.md`mb-4`]}>
        <PrimaryButton disabled={!isAmountValid} onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
        {showBackupReminder && <BackupReminderIcon />}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
