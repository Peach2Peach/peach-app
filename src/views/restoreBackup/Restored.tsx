import React, { ReactElement, useContext } from 'react'
import { Image, View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { Button, Text } from '../../components'
import i18n from '../../utils/i18n'
import { StackNavigationProp } from '@react-navigation/stack'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'restoreBackup'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  const finish = () => {
    navigation.replace('home', {})
  }

  return <View style={tw`h-full flex px-6`}>
    <View style={[
      tw`h-full flex-shrink p-6 pt-32 flex-col items-center`,
      tw.md`pt-36`
    ]}>
      <Image source={require('../../../assets/favico/peach-logo.png')}
        style={[tw`h-24`, tw.md`h-32`, { resizeMode: 'contain' }]}
      />
      <View style={[tw`mt-11 w-full`, tw.md`mt-14`]}>
        <Text style={tw`font-baloo text-center text-3xl leading-3xl text-peach-1`}>
          {i18n('backupRestored')}
        </Text>
        <Text style={tw`mt-4 text-center`}>
          {i18n('restoreBackup.restored.description.1')}
        </Text>
      </View>
    </View>
    <View style={tw`pb-8 mt-4 flex items-center w-full bg-white-1`}>
      <Button
        onPress={finish}
        wide={false}
        title={i18n('continue')}
      />
    </View>
  </View>
}