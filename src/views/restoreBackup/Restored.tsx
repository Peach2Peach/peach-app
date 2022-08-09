import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import Logo from '../../assets/logo/peachLogo.svg'
import { Button, Text } from '../../components'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'

type Props = {
  navigation: StackNavigation;
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
      <Logo style={[tw`h-24`, tw.md`h-32`]} />
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