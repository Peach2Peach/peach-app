import { View } from 'react-native'
import { PrimaryButton } from '../../components'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BackupReminderIcon } from '../buy/BackupReminderIcon'
import { LoadingScreen } from '../loading/LoadingScreen'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { SellAmountSelector } from './SellAmountSelector'
import { FundMultipleOffers } from './components/FundMultipleOffers'
import { useSellSetup } from './hooks/useSellSetup'

export const Sell = () => {
  const { isAmountValid, isLoading, next } = useSellSetup({ help: 'sellingBitcoin', hideGoBackButton: true })
  const showBackupReminder = useSettingsStore((state) => state.showBackupReminder)

  if (isLoading) return <LoadingScreen />

  return (
    <View style={tw`h-full`}>
      <SellAmountSelector style={tw`mt-4 mb-2`}>
        <FundMultipleOffers />
      </SellAmountSelector>
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
