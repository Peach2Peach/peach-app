import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, PeachScrollView, PrimaryButton, Shadow, Text, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { innerShadow } from '../../utils/layout'
import { StackNavigation } from '../../utils/navigation'

type Props = {
  navigation: StackNavigation
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  const reasons = ['bug', 'userProblem', 'question', 'other'] as const
  const setReason = (reason: ContactReason) => navigation.navigate('report', { reason })

  return (
    <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
      <Title title={i18n('contact.title')} />
      <View style={tw`h-full flex-shrink overflow-hidden rounded mt-12`}>
        <Shadow shadow={innerShadow} style={tw`w-full h-full border border-grey-4 rounded`}>
          <PeachScrollView contentContainerStyle={[tw`p-10 flex items-center justify-center`, tw.md`p-12`]}>
            <Text style={tw`text-center mb-8`}>{i18n('contact.whyAreYouContactingUs')}</Text>
            {reasons.map((reason) => (
              <PrimaryButton onPress={() => setReason(reason)} style={tw`mt-2`} wide>
                {i18n(`contact.reason.${reason}`)}
              </PrimaryButton>
            ))}
          </PeachScrollView>
        </Shadow>
      </View>
      <GoBackButton style={tw`flex items-center mt-12`} />
    </View>
  )
}
