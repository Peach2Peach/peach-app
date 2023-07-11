import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { PrimaryButton } from '../../components'
import { ProgressDonut } from '../../components/ui'
import { useNavigation } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import LoadingScreen from '../loading/LoadingScreen'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { BackupReminderIcon } from './BackupReminderIcon'
import { useBuySetup } from './hooks/useBuySetup'
import { BuyAmountSelector } from './BuyAmountSelector'

export default () => {
  const navigation = useNavigation()
  const { freeTrades, maxFreeTrades } = useBuySetup()

  const showBackupReminder = useSettingsStore((state) => state.showBackupReminder)
  const [showLoading, rangeIsValid] = useOfferPreferences(
    (state) => [state.buyAmountRange[1] === Infinity, state.canContinue.buyAmountRange],
    shallow,
  )

  const next = () => navigation.navigate('buyPreferences')

  return showLoading ? (
    <LoadingScreen />
  ) : (
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
