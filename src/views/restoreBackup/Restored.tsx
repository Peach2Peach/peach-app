import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Text } from '../../components'
import i18n from '../../utils/i18n'
import { StackNavigationProp } from '@react-navigation/stack'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'welcome'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  return <View>
    <Text style={[tw`font-baloo text-center text-3xl leading-3xl text-peach-1`, tw.md`text-5xl`]}>
      {i18n('backupRestored')}
    </Text>
    <Text style={tw`mt-4 text-center`}>
      {i18n('restoreBackup.restored.description.1')}
    </Text>
    <View style={tw`mt-8 flex items-center`}>
      <Button
        onPress={() => navigation.navigate('home')}
        wide={false}
        title={i18n('continue')}
      />
    </View>
  </View>
}