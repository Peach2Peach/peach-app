import { useMemo, useState } from 'react'

import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup } from '../../../hooks'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSetCustomReferralCodeOverlay } from '../../../overlays/referral/useSetCustomReferralCodeOverlay'
import i18n from '../../../utils/i18n'
import { isRewardAvailable } from '../helpers/isRewardAvailable'
import { useRedeemNoPeachFeesReward } from '../../../overlays/referral/useRedeemNoPeachFeesReward'

const BARLIMIT = 400
const REWARDINFO: Reward[] = [
  { id: 'customReferralCode', requiredPoints: 100 },
  { id: 'noPeachFees', requiredPoints: 200 },
  { id: 'sats', requiredPoints: 300 },
]
export const useReferralsSetup = () => {
  const showHelp = useShowHelp('referrals')
  const { setCustomReferralCodeOverlay } = useSetCustomReferralCodeOverlay()
  const redeemNoPeachFeesReward = useRedeemNoPeachFeesReward()

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('settings.referrals'),
        icons: [
          {
            iconComponent: <HelpIcon />,
            onPress: showHelp,
          },
        ],
      }),
      [showHelp],
    ),
  )
  const { user } = useSelfUser()
  const pointsBalance = user?.bonusPoints || 0
  const [selectedReward, setSelectedReward] = useState<RewardType>()

  const availableRewards = REWARDINFO.filter((reward) => isRewardAvailable(reward, pointsBalance)).length

  const redeem = async () => {
    switch (selectedReward) {
    case 'customReferralCode':
      setCustomReferralCodeOverlay()
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
    BARLIMIT,
    REWARDINFO,
    availableRewards,
    selectedReward,
    setSelectedReward,
    redeem,
  }
}
