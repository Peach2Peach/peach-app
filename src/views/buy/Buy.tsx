import { View } from 'react-native'
import { PrimaryButton } from '../../components'
import { ProgressDonut } from '../../components/ui'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { LoadingScreen } from '../loading/LoadingScreen'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { BackupReminderIcon } from './BackupReminderIcon'
import { BuyAmountSelector } from './BuyAmountSelector'
import { useBuySetup } from './hooks/useBuySetup'

export const Buy = () => {
  const { freeTrades, maxFreeTrades, isLoading, rangeIsValid, next } = useBuySetup()
  const showBackupReminder = useSettingsStore((state) => state.showBackupReminder)

  if (isLoading) return <LoadingScreen />

  return (
    <View style={tw`flex h-full`}>
      <BuyAmountSelector style={tw`mt-4 mb-2`} />
      <View style={[tw`flex-row items-center justify-center mt-4 mb-1`, tw.md`mb-4`]}>
        {freeTrades > 0 && (
          <ProgressDonut
            style={tw`absolute bottom-0 left-5`}
            title={i18n('settings.referrals.noPeachFees.freeTrades')}
            value={freeTrades}
            max={maxFreeTrades}
          />
        )}
        <PrimaryButton disabled={!rangeIsValid} onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
        {showBackupReminder && <BackupReminderIcon />}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
