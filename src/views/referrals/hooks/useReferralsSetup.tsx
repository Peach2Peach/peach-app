import React, { useMemo, useState } from 'react'

import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup } from '../../../hooks'
import { useUserPrivate } from '../../../hooks/query/useUserPrivate'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { isRewardAvailable } from '../helpers/isRewardAvailable'

const BARLIMIT = 400
const REWARDINFO: Reward[] = [
  { id: 'customReferralCode', requiredPoints: 100 },
  { id: 'noPeachFees', requiredPoints: 200 },
  { id: 'sats', requiredPoints: 300 },
]
export const useReferralsSetup = () => {
  const showHelp = useShowHelp('referrals')
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
  const { user } = useUserPrivate(account.publicKey)
  const pointsBalance = user?.bonusPoints || 0
  const [selectedReward, setSelectedReward] = useState<RewardType>()

  const availableRewards = REWARDINFO.filter((reward) => isRewardAvailable(reward, pointsBalance)).length
  return {
    user,
    pointsBalance,
    BARLIMIT,
    REWARDINFO,
    availableRewards,
    selectedReward,
    setSelectedReward,
  }
}
