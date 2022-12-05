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

const contactReasons = ['bug', 'userProblem', 'question', 'newMethod', 'other'] as const
type ContactReason = typeof contactReasons[number]
type ContactButtonProps = { name: ContactReason; setReason: Function }

const ContactButton = ({ name, setReason }: ContactButtonProps) => (
  <PrimaryButton onPress={() => setReason(name)} style={tw`mt-2`} wide>
    {i18n(`contact.reason.${name}`)}
  </PrimaryButton>
)

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  const setReason = (reason: ContactReason) => navigation.navigate('report', { reason })

  return (
    <PeachScrollView contentContainerStyle={tw`px-6 pt-6 pb-10`}>
      <Title title={i18n('contact.title')} />
      <View style={tw`overflow-hidden rounded mt-12`}>
        <Shadow shadow={innerShadow} style={tw`border border-grey-4 rounded`}>
          <View style={[tw`p-10 flex items-center justify-center`]}>
            <Text style={tw`text-center mb-8`}>{i18n('contact.whyAreYouContactingUs')}</Text>
            {contactReasons.map((name) => (
              <ContactButton {...{ name, setReason, key: `contact-button-${name}` }} />
            ))}
          </View>
        </Shadow>
      </View>
      <GoBackButton style={tw`self-center mt-12`} />
    </PeachScrollView>
  )
}
