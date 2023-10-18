import { Dispatch, SetStateAction } from 'react'
import { RadioButtons, Text } from '../../../components'
import { Button } from '../../../components/buttons/Button'
import { RadioButtonItem } from '../../../components/inputs/RadioButtons'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { thousands } from '../../../utils/string'
import { mapRewardsToRadioButtonItems } from '../helpers/mapRewardsToRadioButtonItems'

type Props = {
  balance: number
  referredTradingAmount: number
  availableRewards: number
  selectedReward?: RewardType
  setSelectedReward: Dispatch<SetStateAction<RewardType | undefined>>
  redeem: () => void
}
export const ReferralRewards = ({
  balance,
  referredTradingAmount,
  availableRewards,
  selectedReward,
  setSelectedReward,
  redeem,
}: Props) => {
  const rewards: RadioButtonItem<RewardType>[] = mapRewardsToRadioButtonItems(balance)

  return (
    <>
      <Text style={tw`my-4 text-center body-m mx-7`}>
        {i18n(
          !referredTradingAmount ? 'referrals.notTraded' : 'referrals.alreadyTraded',
          i18n('currency.format.sats', thousands(referredTradingAmount || 0)),
        )}
        {'\n\n'}
        {i18n(availableRewards ? 'referrals.selectReward' : 'referrals.continueSaving')}
      </Text>
      <RadioButtons selectedValue={selectedReward} items={rewards} onButtonPress={setSelectedReward} />
      <Button style={tw`self-center mt-5 mb-10`} onPress={redeem} disabled={!selectedReward} iconId={'gift'}>
        {i18n('referrals.reward.select')}
      </Button>
    </>
  )
}
