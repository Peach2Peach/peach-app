import { useState } from 'react'
import { useHeaderSetup } from '../../../hooks'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useRedeemNoPeachFeesReward } from '../../../popups/referral/useRedeemNoPeachFeesReward'
import { useSetCustomReferralCodePopup } from '../../../popups/referral/useSetCustomReferralCodePopup'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { isRewardAvailable } from '../helpers/isRewardAvailable'
import { REWARDINFO } from '../Referrals'

export const useReferralsSetup = () => {
  const showHelp = useShowHelp('referrals')
  const { setCustomReferralCodePopup } = useSetCustomReferralCodePopup()
  const redeemNoPeachFeesReward = useRedeemNoPeachFeesReward()

  useHeaderSetup({
    title: i18n('settings.referrals'),
    icons: [{ ...headerIcons.help, onPress: showHelp }],
  })
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
