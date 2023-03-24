import React, { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { OptionButton, PeachScrollView } from '../../components'
import LinedText from '../../components/ui/LinedText'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { ContactButton } from './components/ContactButton'
import { useContactSetup } from './hooks/useContactSetup'

const contactReasonsNoAccount = ['bug', 'accountLost', 'question', 'sellMore', 'other'] as ContactReason[]
const contactReasons = ['bug', 'userProblem', 'sellMore', 'other'] as ContactReason[]

export default (): ReactElement => {
  const { setReason, openTelegram, openDiscord } = useContactSetup()

  return (
    <PeachScrollView contentContainerStyle={tw`justify-center flex-grow`}>
      <View style={tw`items-center p-10`}>
        <LinedText style={tw`mb-3`}>
          <Text style={tw`body-m text-black-2`}>{i18n('report.mailUs')}</Text>
        </LinedText>
        <View style={tw`w-full px-2 mt-3 mb-6`}>
          {(account?.publicKey ? contactReasons : contactReasonsNoAccount).map((reason) => (
            <ContactButton {...{ reason, setReason, key: `contact-button-${reason}` }} />
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
