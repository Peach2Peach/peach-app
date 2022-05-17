import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Button, Shadow, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { innerShadow } from '../../utils/layout'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contact'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  const setReason = (reason: ContactReason) => navigation.navigate('report', { reason })

  return <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
    <Title title={i18n('contact.title')} />
    <View style={tw`h-full flex-shrink overflow-hidden rounded mt-12`}>
      <Shadow shadow={innerShadow}
        style={tw`w-full h-full border border-grey-4 rounded px-12 flex items-center justify-center`}>
        <Text style={tw`text-center mb-10`}>
          {i18n('contact.whyAreYouContactingUs')}
        </Text>
        <Button
          title={i18n('contact.reason.bug')}
          onPress={() => setReason('bug')}
          wide={true}
          secondary={true}
        />
        <Button
          title={i18n('contact.reason.userProblem')}
          onPress={() => setReason('userProblem')}
          style={tw`mt-2`}
          wide={true}
          secondary={true}
        />
        <Button
          title={i18n('contact.reason.question')}
          onPress={() => setReason('question')}
          style={tw`mt-2`}
          wide={true}
          secondary={true}
        />
        <Button
          title={i18n('contact.reason.other')}
          onPress={() => setReason('other')}
          style={tw`mt-2`}
          wide={true}
          secondary={true}
        />
      </Shadow>
    </View>
    <View style={tw`flex items-center mt-16`}>
      <Button
        title={i18n('back')}
        wide={false}
        secondary={true}
        onPress={navigation.goBack}
      />
    </View>
  </View>
}

