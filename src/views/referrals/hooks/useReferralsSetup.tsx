import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { Text } from '../../../components'
import { HelpIcon } from '../../../components/icons'
import { RadioButtonItem } from '../../../components/inputs/RadioButtons'
import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { getUserPrivate } from '../../../utils/peachAPI'

type Reward = '' | 'customReferralCode' | 'noPeachFees' | 'sats'

const BARLIMIT = 400

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

  const rewards: RadioButtonItem<Reward>[] = [
    ['customReferralCode', 100, '100'],
    ['noPeachFees', 200, '200'],
    ['sats', 300, '> 300'],
  ].map(
    ([reward, pointsRequired, cost]) =>
      ({
        value: reward,
        disabled: pointsRequired > pointsBalance || reward === 'sats',
        display: (
          <View style={tw`flex-row items-center justify-between py-1`}>
            <Text style={tw`subtitle-1`}>{i18n(`referrals.reward.${reward}`)}</Text>
            <Text style={tw`mr-2 body-m text-black-2`}>({cost})</Text>
          </View>
        ),
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
