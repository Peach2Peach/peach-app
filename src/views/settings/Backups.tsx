import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'

import tw from '../../styles/tailwind'

import { Button, Card, Text, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import { OverlayContext } from '../../contexts/overlay'
import { BackupCreated } from '../../overlays/BackupCreated'
import SaveAccount from '../../overlays/info/SaveAccount'
import { account, backupAccount, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import { toShortDateFormat } from '../../utils/string'

type Props = {
  navigation: StackNavigation
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const initAccountBackup = () => {
    const previousDate = account.settings.lastBackupDate

    updateSettings(
      {
        lastBackupDate: new Date().getTime(),
        showBackupReminder: false,
      },
      true,
    )
    backupAccount({
      onSuccess: () => {
        updateOverlay({
          content: <BackupCreated />,
          showCloseButton: false,
        })
        updateSettings(
          {
            lastBackupDate: new Date().getTime(),
            showBackupReminder: false,
          },
          true,
        )
        setTimeout(() => {
          updateOverlay({
            content: null,
            showCloseButton: true,
          })
        }, 3000)
      },
      onError: () => {
        updateSettings({
          lastBackupDate: previousDate,
        })
      },
    })
  }

  const goTo12Words = () => navigation.navigate('seedWords', {})

  return (
    <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.backups.subtitle')} help={<SaveAccount />} />
      <View style={tw`h-full flex-shrink mt-12`}>
        {account.settings.lastBackupDate ? (
          <Text style={tw`text-center text-grey-1`}>
            {i18n('settings.backups.lastBackup')} {toShortDateFormat(new Date(account.settings.lastBackupDate), true)}
          </Text>
        ) : null}
        <Pressable style={tw`mt-2`} onPress={initAccountBackup}>
          <Card>
            <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.backups.createNew')}</Text>
          </Card>
        </Pressable>
        {/* <Pressable style={tw`mt-2`} onPress={goTo12Words}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.backups.view12Words')}</Text>
        </Card>
      </Pressable> */}
      </View>
      <View style={tw`flex items-center mt-16`}>
        <Button title={i18n('back')} wide={false} secondary={true} onPress={navigation.goBack} />
      </View>
    </View>
  )
}
