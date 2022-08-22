import React, { ReactElement, useCallback, useContext, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { Button, Card, Loading, PeachScrollView, RadioButtons, Text, Title } from '../../components'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { Navigation } from '../../utils/navigation'
import { getUserPrivate } from '../../utils/peachAPI'
import { thousands } from '../../utils/string'

type Props = {
  navigation: Navigation
}

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  const [user, setUser] = useState<User>()

  const rewards = [
    {
      value: 'customCode',
      display: i18n('referrals.reward.customCode'),
    },
    {
      value: 'noPeachFees',
      display: i18n('referrals.reward.noPeachFees'),
    },
    {
      value: 'sats',
      display: i18n('referrals.reward.sats')
    },
  ]

  const shareReferralCode = () => {}
  const selectReward = () => {}

  useFocusEffect(useCallback(() => {
    (async () => {
      const [response, err] = await getUserPrivate(account.publicKey)

      if (response) {
        setUser(response)
      }
      // TODO add error handling if request failed
    })()
  }, []))


  return !user
    ? <Loading />
    : <View style={tw`h-full flex items-stretch`}>
      <PeachScrollView contentContainerStyle={tw`pt-6 px-12 pb-10`}>
        <Title title={i18n('referrals.title')} />
        <View style={tw`mt-12`}>
          <Text style={tw`text-center font-bold text-grey-1`}>
            {i18n('referrals.yourCode')}
          </Text>
          <Text style={tw`text-center text-grey-1`}>
            {user.referralCode}
          </Text>
          <View style={tw`flex items-center mt-1`}>
            <Button
              title={i18n('referrals.shareCode')}
              wide={true}
              onPress={shareReferralCode}
            />
          </View>
          <Card style={tw`p-7`}>
            <Text style={tw`text-center text-grey-1`}>
              {i18n('referrals.alreadyTraded', i18n('currency.sats', thousands(user.referredTradingAmount)))}
              {i18n('referrals.selectReward')}
            </Text>
            <RadioButtons
              items={rewards}
            />
            <View style={tw`flex items-center mt-1`}>
              <Button
                title={i18n('referrals.reward.select')}
                wide={false}
                disabled={true}
                onPress={selectReward}
              />
            </View>
          </Card>
        </View>
        <View style={tw`flex items-center mt-16`}>
          <Button
            title={i18n('back')}
            wide={false}
            secondary={true}
            onPress={navigation.goBack}
          />
        </View>
      </PeachScrollView>
    </View>
}

