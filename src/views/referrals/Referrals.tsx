import { PeachScrollView, Screen } from '../../components'
import tw from '../../styles/tailwind'
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
