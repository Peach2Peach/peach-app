import { Linking, View } from 'react-native'
import { NewHeader as Header, OptionButton, PeachScrollView, Screen, Text } from '../../components'
import { LinedText } from '../../components/ui/LinedText'
import { DISCORD, TELEGRAM } from '../../constants'
import { useNavigation } from '../../hooks'
import { useShowHelp } from '../../hooks/useShowHelp'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'

export const contactReasonsNoAccount: ContactReason[] = ['bug', 'accountLost', 'question', 'sellMore', 'other']
export const contactReasonsWithAccount: ContactReason[] = ['bug', 'userProblem', 'sellMore', 'other']
const openTelegram = () => Linking.openURL(TELEGRAM)
const openDiscord = () => Linking.openURL(DISCORD)

export const Contact = () => {
  const navigation = useNavigation()

  const showHelp = useShowHelp('contactEncryption', false)
  const goToReport = (reason: ContactReason) => {
    navigation.navigate('report', { reason, shareDeviceID: reason === 'accountLost' })
  }

  const contactReasons = account?.publicKey ? contactReasonsWithAccount : contactReasonsNoAccount

  return (
    <Screen>
      <Header title={i18n('contact.title')} icons={[{ ...headerIcons.help, onPress: showHelp }]} />
      <PeachScrollView contentContainerStyle={tw`justify-center grow`} contentStyle={tw`gap-12`}>
        <View style={tw`w-full gap-4`}>
          <LinedText>
            <Text style={tw`text-black-2`}>{i18n('report.mailUs')}</Text>
          </LinedText>
          <>
            {contactReasons.map((reason) => (
              <ContactButton reason={reason} goToReport={goToReport} key={`contact-button-${reason}`} />
            ))}
          </>
        </View>
        <View style={tw`w-full gap-4`}>
          <LinedText>
            <Text style={tw`text-black-2`}>{i18n('report.communityHelp')}</Text>
          </LinedText>
          <OptionButton onPress={openTelegram}>{i18n('telegram')}</OptionButton>
          <OptionButton onPress={openDiscord}>{i18n('discord')}</OptionButton>
        </View>
      </PeachScrollView>
    </Screen>
  )
}

type Props = { reason: ContactReason; goToReport: (name: ContactReason) => void }

function ContactButton ({ reason, goToReport }: Props) {
  return <OptionButton onPress={() => goToReport(reason)}>{i18n(`contact.reason.${reason}`)}</OptionButton>
}
