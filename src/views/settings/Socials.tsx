import React, { ReactElement, useContext } from 'react'
import {
  Linking,
  Pressable,
  View
} from 'react-native'

import tw from '../../styles/tailwind'

import { Button, Card, Icon, Text, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'

type Props = {
  navigation: StackNavigation
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  const goToTwitter = () => Linking.openURL('https://twitter.com/peachbitcoin')
  const goToInstagram = () => Linking.openURL('https://www.instagram.com/peachbitcoin')
  const goToTelegram = () => Linking.openURL('https://t.me/+3KpdrMw25xBhNGJk')
  const goToDiscord = () => Linking.openURL('https://discord.gg/skP9zqTB')

  return <View style={tw`h-full pb-10 pt-6 px-12`}>
    <Title title={i18n('settings.title')} subtitle={i18n('settings.socials.subtitle')} />
    <View style={tw`h-full flex-shrink flex justify-center`}>
      <Pressable onPress={goToTwitter}>
        <Card style={tw`flex-row items-center justify-center`}>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('twitter')}</Text>
          <Icon id="link" style={tw`w-3 h-3`} color={tw`text-grey-2`.color as string} />
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToInstagram}>
        <Card style={tw`flex-row items-center justify-center`}>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('instagram')}</Text>
          <Icon id="link" style={tw`w-3 h-3`} color={tw`text-grey-2`.color as string} />
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToTelegram}>
        <Card style={tw`flex-row items-center justify-center`}>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('telegram')}</Text>
          <Icon id="link" style={tw`w-3 h-3`} color={tw`text-grey-2`.color as string} />
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToDiscord}>
        <Card style={tw`flex-row items-center justify-center`}>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('discord')}</Text>
          <Icon id="link" style={tw`w-3 h-3`} color={tw`text-grey-2`.color as string} />
        </Card>
      </Pressable>
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

