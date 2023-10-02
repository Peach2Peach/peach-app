import { useState } from 'react'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useRedeemNoPeachFeesReward } from '../../../popups/referral/useRedeemNoPeachFeesReward'
import { useSetCustomReferralCodePopup } from '../../../popups/referral/useSetCustomReferralCodePopup'
import { REWARDINFO } from '../constants'
import { isRewardAvailable } from '../helpers/isRewardAvailable'

export const useReferralsSetup = () => {
  const { setCustomReferralCodePopup } = useSetCustomReferralCodePopup()
  const redeemNoPeachFeesReward = useRedeemNoPeachFeesReward()

  const { user } = useSelfUser()
  const pointsBalance = user?.bonusPoints || 0
  const [selectedReward, setSelectedReward] = useState<RewardType>()

  const availableRewards = REWARDINFO.filter((reward) => isRewardAvailable(reward, pointsBalance)).length

  const redeem = () => {
    switch (selectedReward) {
    case 'customReferralCode':
      setCustomReferralCodePopup()
      break
    case 'noPeachFees':
      redeemNoPeachFeesReward()
      break
    default:
      break
    }
  }

  return {
    user,
    pointsBalance,
    availableRewards,
    selectedReward,
    setSelectedReward,
    redeem,
  }
}
