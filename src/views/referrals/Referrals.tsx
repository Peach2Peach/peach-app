import { Header, PeachScrollView, Screen } from '../../components'
import { useShowHelp } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { LoadingScreen } from '../loading/LoadingScreen'
import { BonusPointsBar } from './components/BonusPointsBar'
import { ReferralCode } from './components/ReferralCode'
import { ReferralRewards } from './components/ReferralRewards'
import { useReferralsSetup } from './hooks/useReferralsSetup'

export const Referrals = () => {
  const { user, pointsBalance, ...referralRewardProps } = useReferralsSetup()

  if (!user) return <LoadingScreen />
  return (
    <Screen>
      <ReferralsHeader />
      <BonusPointsBar balance={pointsBalance} />
      <PeachScrollView contentContainerStyle={tw`justify-center flex-grow`}>
        <ReferralRewards
          balance={pointsBalance}
          referredTradingAmount={user.referredTradingAmount}
          {...referralRewardProps}
        />
        {user.referralCode && <ReferralCode referralCode={user.referralCode} />}
      </PeachScrollView>
    </Screen>
  )
}

function ReferralsHeader () {
  const showHelp = useShowHelp('referrals')
  return <Header title={i18n('settings.referrals')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}
