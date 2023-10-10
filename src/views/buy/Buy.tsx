import { View } from 'react-native'
import { Header, Screen } from '../../components'
import { Button } from '../../components/buttons/Button'
import { ProgressDonut } from '../../components/ui'
import { useShowHelp } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { LoadingScreen } from '../loading/LoadingScreen'
import { BackupReminderIcon } from './BackupReminderIcon'
import { BuyAmountSelector } from './BuyAmountSelector'
import { BuyTitleComponent } from './components/BuyTitleComponent'
import { useBuySetup } from './hooks/useBuySetup'

export const Buy = () => {
  const { freeTrades, maxFreeTrades, isLoading, rangeIsValid, next } = useBuySetup()
  const showBackupReminder = useSettingsStore((state) => state.showBackupReminder)

  if (isLoading) return <LoadingScreen />

  return (
    <Screen header={<BuyScreenHeader />} showFooter showTradingLimit>
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
        <Button disabled={!rangeIsValid} onPress={next}>
          {i18n('next')}
        </Button>
        {showBackupReminder && <BackupReminderIcon />}
      </View>
    </Screen>
  )
}

function BuyScreenHeader () {
  const showHelp = useShowHelp('buyingBitcoin')

  return (
    <Header
      titleComponent={<BuyTitleComponent />}
      hideGoBackButton
      icons={[{ ...headerIcons.help, onPress: showHelp }]}
      showPriceStats
    />
  )
}
