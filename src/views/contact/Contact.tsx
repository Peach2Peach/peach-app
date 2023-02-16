import React, { ReactElement, useContext, useMemo } from 'react'
import { Linking, View, Text } from 'react-native'

import tw from '../../styles/tailwind'

import { OptionButton, PeachScrollView } from '../../components'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { useHeaderSetup, useNavigation } from '../../hooks'
import LinedText from '../../components/ui/LinedText'
import { account } from '../../utils/account'

const contactReasonsNoAccount = ['bug', 'question', 'sellMore', 'other'] as ContactReason[]
const contactReasons = ['bug', 'userProblem', 'sellMore', 'other'] as ContactReason[]
type ContactButtonProps = { name: ContactReason; setReason: Function }

const ContactButton = ({ name, setReason }: ContactButtonProps) => (
  <OptionButton onPress={() => setReason(name)} style={tw`w-full mb-4`} wide>
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
    <PeachScrollView contentContainerStyle={tw`justify-center flex-grow`}>
      <View style={tw`items-center p-10`}>
        <LinedText style={tw`mb-3`}>
          <Text style={tw`body-m text-black-2`}>{i18n('report.mailUs')}</Text>
        </LinedText>
        <View style={tw`w-full px-2 mt-3 mb-6`}>
          {(account?.publicKey ? contactReasons : contactReasonsNoAccount).map((name) => (
            <ContactButton {...{ name, setReason, key: `contact-button-${name}` }} />
          ))}
        </View>
        <LinedText style={tw`my-3`}>
          <Text style={tw`body-m text-black-2`}>{i18n('report.communityHelp')}</Text>
        </LinedText>
        <View style={tw`items-center w-full px-2 mt-3`}>
          <OptionButton onPress={openTelegram} style={tw`w-full mb-4`} wide>
            {i18n('telegram')}
          </OptionButton>
          <OptionButton onPress={openDiscord} style={tw`w-full mb-4`} wide>
            {i18n('discord')}
          </OptionButton>
        </View>
      </View>
    </PeachScrollView>
  )
}
