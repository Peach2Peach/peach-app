import React, { ReactElement, useContext, useMemo } from 'react'
import { Linking, View, Text } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, OptionButton, PeachScrollView } from '../../components'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { useHeaderSetup, useNavigation } from '../../hooks'
import LinedText from '../../components/ui/LinedText'

const contactReasons = ['bug', 'userProblem', 'other'] as const
type ContactReason = typeof contactReasons[number]
type ContactButtonProps = { name: ContactReason; setReason: Function }

const ContactButton = ({ name, setReason }: ContactButtonProps) => (
  <OptionButton onPress={() => setReason(name)} style={tw`mt-2`} wide>
    {i18n(`contact.reason.${name}`)}
  </OptionButton>
)

export default (): ReactElement => {
  const navigation = useNavigation()
  useContext(LanguageContext)

  const setReason = (reason: ContactReason) => navigation.navigate('report', { reason })

  useHeaderSetup(useMemo(() => ({ title: i18n('contact.title') }), []))

  const openTelegram = () => Linking.openURL('https://t.me/+3KpdrMw25xBhNGJk')

  const openDiscord = () => Linking.openURL('https://discord.gg/skP9zqTB')

  return (
    <View style={tw`p-6 h-full items-center`}>
      <PeachScrollView contentContainerStyle={tw`py-6 flex-1`}>
        <LinedText style={tw`mb-3 mx-5`}>
          <Text style={tw`body-m text-black-2`}>{i18n('report.mailUs')}</Text>
        </LinedText>
        {contactReasons.map((name) => (
          <ContactButton {...{ name, setReason, key: `contact-button-${name}` }} />
        ))}
        <View style={tw`mt-10`}>
          <LinedText style={tw`my-3 mx-5`}>
            <Text style={tw`body-m text-black-2`}>{i18n('report.communityHelp')}</Text>
          </LinedText>
          <OptionButton onPress={openTelegram} style={tw`mt-2`} wide>
            {i18n('telegram')}
          </OptionButton>
          <OptionButton onPress={openDiscord} style={tw`mt-2`} wide>
            {i18n('telegram')}
          </OptionButton>
        </View>
      </PeachScrollView>
      <GoBackButton style={tw`absolute bottom-10`} />
    </View>
  )
}
