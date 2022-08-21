import React, { ReactElement, useCallback, useContext, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { Button, Loading, PeachScrollView, Text, Title } from '../../components'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { Navigation } from '../../utils/navigation'
import { getUserPrivate } from '../../utils/peachAPI'

type Props = {
  navigation: Navigation
}

export default ({ navigation }: Props): ReactElement => {
  const [user, setUser] = useState<User>()

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

