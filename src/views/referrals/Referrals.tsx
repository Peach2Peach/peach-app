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
import { BonusPointsBar } from './components/BonusPointsBar'

type Props = {
  navigation: Navigation
}

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  const [user, setUser] = useState<User>()

  const rewards = [
    ['customReferralCode', '100'],
    ['noPeachFees', '200'],
    ['sats', '> 300'],
  ].map(([reward, pointsRequired]) => ({
    value: reward,
    disabled: true,
    display: <Text style={tw`font-baloo text-sm`}>
      {i18n(`referrals.reward.${reward}`)} <Text style={tw`text-sm text-grey-2`}>({pointsRequired})</Text>
    </Text>
  }))

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
        <BonusPointsBar style={tw`mt-2`} points={user?.bonusPoints || 0} />
        <View style={tw`mt-8`}>
          <Text style={tw`text-center font-baloo text-grey-2 leading-6`}>
            {i18n('referrals.yourCode')}
          </Text>
          <Text style={tw`text-center text-grey-1 font-baloo text-2xl leading-2xl mt-1`}>
            {user.referralCode}
          </Text>
          <View style={tw`flex items-center mt-1`}>
            <Button
              title={i18n('referrals.shareCode')}
              wide={true}
              onPress={shareReferralCode}
            />
          </View>
          <Card style={tw`mt-10 p-7`}>
            <Text style={tw`text-center text-grey-1`}>
              {i18n(
                'referrals.alreadyTraded',
                i18n('currency.format.sats', thousands(user.referredTradingAmount || 0))
              )}
              {'\n\n'}
              {i18n('referrals.selectReward')}
            </Text>
            <RadioButtons style={tw`mt-4`}
              items={rewards}
            />
            <View style={tw`flex items-center mt-5`}>
              <Button
                title={i18n('referrals.reward.select')}
                wide={false}
                disabled={true}
                onPress={selectReward}
              />
            </View>
            <Text style={tw`text-center text-grey-1 text-sm mt-1`}>
              {i18n('referrals.reward.comingSoon')}
            </Text>
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

