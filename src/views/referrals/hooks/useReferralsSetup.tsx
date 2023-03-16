import React, { useCallback, useMemo, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { HelpIcon } from '../../../components/icons'
import { RadioButtonItem } from '../../../components/inputs/RadioButtons'
import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { getUserPrivate } from '../../../utils/peachAPI'
import { RewardItem } from '../components/RewardItem'

const BARLIMIT = 400
const REWARDINFO: [Reward, number, string][] = [
  ['customReferralCode', 100, '100'],
  ['noPeachFees', 200, '200'],
  ['sats', 300, '> 300'],
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
  const [user, setUser] = useState<User>()
  const pointsBalance = user?.bonusPoints || 0
  const [selectedReward, setSelectedReward] = useState<Reward>('')

  const rewards: RadioButtonItem<Reward>[] = REWARDINFO.map(
    ([reward, pointsRequired, cost]) =>
      ({
        value: reward,
        disabled: pointsRequired > pointsBalance || reward === 'sats',
        display: <RewardItem {...{ reward, cost }} />,
      } as RadioButtonItem<Reward>),
  )
  const availableRewards = rewards.filter((reward) => !reward.disabled).length

  const redeemReward = () => {
    // TO BE IMPLEMENTED IN 0.2.1
    switch (selectedReward) {
    case 'customReferralCode':
      break
    case 'noPeachFees':
      break
    default:
      break
    }
  }

  useFocusEffect(
    useCallback(() => {
      ;(async () => {
        const [response] = await getUserPrivate({ userId: account.publicKey })

        if (response) {
          setUser(response)
        }
        // TODO add error handling if request failed
      })()
    }, []),
  )

  return {
    user,
    pointsBalance,
    BARLIMIT,
    availableRewards,
    selectedReward,
    setSelectedReward,
    rewards,
    redeemReward,
  }
}
