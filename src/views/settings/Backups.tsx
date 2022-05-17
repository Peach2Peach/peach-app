import React, { ReactElement, useContext, useReducer, useState } from 'react'
import { Pressable, View } from 'react-native'

import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Button, Card, Headline, Icon, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { account, backupAccount, updateSettings } from '../../utils/account'
import { OverlayContext } from '../../contexts/overlay'
import { toShortDateFormat } from '../../utils/string'

const BackupCreated = () => <View style={tw`flex items-center`}>
  <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
    {i18n('settings.backups.created')}
  </Headline>
  <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
    <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color as string} />
  </View>
</View>

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contact'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const initAccountBackup = () => {
    backupAccount(() => {
      updateSettings({
        lastBackupDate: (new Date()).getTime()
      })
      updateOverlay({
        content: <BackupCreated />,
        showCloseButton: false
      })
      setTimeout(() => {
        updateOverlay({
          content: null,
          showCloseButton: true
        })
      }, 3000)
    })
  }

  const goTo12Words = () => navigation.navigate('seedWords', {})

  return <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
    <Title title={i18n('settings.title')} subtitle={i18n('settings.backups.subtitle')} />
    <View style={tw`h-full flex-shrink mt-12`}>
      {account.settings.lastBackupDate
        ? <Text style={tw`text-center text-grey-1`}>
          {i18n('settings.backups.lastBackup')} {toShortDateFormat(new Date(account.settings.lastBackupDate), true)}
        </Text>
        : null
      }
      <Pressable style={tw`mt-2`} onPress={initAccountBackup}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>
            {i18n('settings.backups.createNew')}
          </Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goTo12Words}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.backups.view12Words')}</Text>
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

