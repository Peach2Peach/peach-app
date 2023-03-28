import { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { CopyAble, PeachScrollView, PrimaryButton, Progress, RadioButtons, Text } from '../../components'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'
import LoadingScreen from '../loading/LoadingScreen'
import { useReferralsSetup } from './hooks/useReferralsSetup'
import { RadioButtonItem } from '../../components/inputs/RadioButtons'
import { isRewardAvailable } from './helpers/isRewardAvailable'
import { RewardItem } from './components/RewardItem'

export default (): ReactElement => {
  const { user, pointsBalance, REWARDINFO, BARLIMIT, availableRewards, selectedReward, setSelectedReward, redeem }
    = useReferralsSetup()

  const rewards: RadioButtonItem<RewardType>[] = REWARDINFO.map((reward) => ({
    value: reward.id,
    disabled: !isRewardAvailable(reward, pointsBalance),
    display: <RewardItem reward={reward} />,
  }))

  if (!user) return <LoadingScreen />
  return (
    <View style={tw`flex h-full px-7 `}>
      <Progress
        style={tw`h-3 rounded`}
        backgroundStyle={tw`border-2 bg-primary-mild-1 border-primary-background`}
        barStyle={tw`border-2 bg-primary-main border-primary-background`}
        percent={pointsBalance / BARLIMIT}
      />
      <Text style={tw`pl-2 tooltip text-black-2`}>
        {i18n('referrals.points')}: <Text style={tw`font-bold tooltip text-black-2`}>{pointsBalance}</Text>
      </Text>
      <PeachScrollView contentContainerStyle={tw`justify-center flex-grow pb-10`}>
        <Text style={tw`my-4 text-center body-m mx-7`}>
          {i18n(
            !user.referredTradingAmount ? 'referrals.notTraded' : 'referrals.alreadyTraded',
            i18n('currency.format.sats', thousands(user.referredTradingAmount || 0)),
          )}
          {'\n\n'}
          {i18n(availableRewards ? 'referrals.selectReward' : 'referrals.continueSaving')}
        </Text>
        <RadioButtons selectedValue={selectedReward} items={rewards} onChange={setSelectedReward} />
        <View style={tw`flex items-center mt-5 mb-10`}>
          <PrimaryButton onPress={redeem} wide disabled={!selectedReward} iconId={'gift'}>
            {i18n('referrals.reward.select')}
          </PrimaryButton>
        </View>
        {user.referralCode && (
          <>
            <Text style={tw`text-center body-m text-black-2`}>{i18n('referrals.yourCode')}</Text>
            <View style={tw`flex-row justify-center`}>
              <Text style={tw`mr-1 text-center h4`}>{user.referralCode}</Text>
              <CopyAble value={user.referralCode} style={tw`w-7 h-7`} />
            </View>
          </>
        )}
      </PeachScrollView>
    </View>
  )
}
