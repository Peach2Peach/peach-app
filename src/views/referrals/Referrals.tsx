import { useState } from 'react'
import { View } from 'react-native'
import { Header } from '../../components/Header'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/buttons/Button'
import { RadioButtonItem, RadioButtons } from '../../components/inputs/RadioButtons'
import { PeachText } from '../../components/text/PeachText'
import { Progress } from '../../components/ui/Progress'
import { useSelfUser } from '../../hooks/query/useSelfUser'
import { useShowHelp } from '../../hooks/useShowHelp'
import { useRedeemNoPeachFeesReward } from '../../popups/referral/useRedeemNoPeachFeesReward'
import { useSetCustomReferralCodePopup } from '../../popups/referral/useSetCustomReferralCodePopup'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { thousands } from '../../utils/string/thousands'
import { ReferralCode } from './components/ReferralCode'
import { REWARDINFO } from './constants'
import { isRewardAvailable } from './helpers/isRewardAvailable'
import { mapRewardsToRadioButtonItems } from './helpers/mapRewardsToRadioButtonItems'

export const Referrals = () => (
  <Screen header={<ReferralsHeader />}>
    <BonusPointsBar />
    <PeachScrollView contentContainerStyle={tw`justify-center grow`} contentStyle={tw`gap-4 py-4`}>
      <ReferralRewards />
      <ReferralCode />
    </PeachScrollView>
  </Screen>
)

function ReferralsHeader () {
  const showHelp = useShowHelp('referrals')
  return <Header title={i18n('settings.referrals')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}

function ReferralRewards () {
  const { user } = useSelfUser()
  const balance = user?.bonusPoints || 0
  const referredTradingAmount = user?.referredTradingAmount || 0

  const availableRewards = REWARDINFO.filter((reward) => isRewardAvailable(reward, balance)).length
  const [selectedReward, setSelectedReward] = useState<RewardType>()

  const rewards: RadioButtonItem<RewardType>[] = mapRewardsToRadioButtonItems(balance)

  return (
    <>
      <PeachText style={tw`text-center`}>
        {i18n(
          !referredTradingAmount ? 'referrals.notTraded' : 'referrals.alreadyTraded',
          i18n('currency.format.sats', thousands(referredTradingAmount)),
        )}
        {'\n\n'}
        {i18n(availableRewards ? 'referrals.selectReward' : 'referrals.continueSaving')}
      </PeachText>
      <RadioButtons items={rewards} selectedValue={selectedReward} onButtonPress={setSelectedReward} />
      <RedeemButton selectedReward={selectedReward} />
    </>
  )
}

function RedeemButton ({ selectedReward }: { selectedReward: RewardType | undefined }) {
  const showCustomReferralCodePopup = useSetCustomReferralCodePopup()
  const redeemNoPeachFeesReward = useRedeemNoPeachFeesReward()
  const redeem = () => {
    if (selectedReward === 'customReferralCode') {
      showCustomReferralCodePopup()
    } else if (selectedReward === 'noPeachFees') {
      redeemNoPeachFeesReward()
    }
  }
  return (
    <Button style={tw`self-center`} disabled={!selectedReward} onPress={redeem} iconId={'gift'}>
      {i18n('referrals.reward.select')}
    </Button>
  )
}

function BonusPointsBar () {
  const BARLIMIT = 400
  const { user } = useSelfUser()
  const balance = user?.bonusPoints || 0

  return (
    <View>
      <Progress
        style={tw`h-3 rounded`}
        backgroundStyle={tw`border-2 bg-primary-mild-1 border-primary-background`}
        barStyle={tw`border-2 bg-primary-main border-primary-background`}
        percent={balance / BARLIMIT}
      />
      <PeachText style={tw`pl-2 tooltip text-black-2`}>
        {i18n('referrals.points')}: <PeachText style={tw`font-bold tooltip text-black-2`}>{balance}</PeachText>
      </PeachText>
    </View>
  )
}
