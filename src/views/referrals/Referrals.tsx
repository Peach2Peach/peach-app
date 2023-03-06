import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { CopyAble, Loading, PeachScrollView, PrimaryButton, Progress, RadioButtons, Text } from '../../components'
import { HelpIcon } from '../../components/icons'
import { RadioButtonItem } from '../../components/inputs/RadioButtons'
import { useHeaderSetup } from '../../hooks'
import { useShowHelp } from '../../hooks/useShowHelp'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { getUserPrivate } from '../../utils/peachAPI'
import { thousands } from '../../utils/string'

type Reward = '' | 'customReferralCode' | 'noPeachFees' | 'sats'

export default (): ReactElement => {
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

  const BARLIMIT = 400

  return !user ? (
    <View style={tw`absolute items-center justify-center w-full h-full`}>
      <Loading />
    </View>
  ) : (
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
          <PrimaryButton wide disabled={selectedReward !== null} onPress={redeemReward} iconId={'gift'}>
            {i18n('referrals.reward.select')}
          </PrimaryButton>
          <Text style={tw`text-center body-m text-black-2`}>{i18n('referrals.reward.comingSoon')}</Text>
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
