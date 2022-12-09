import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Button, Card, Text } from '../../../../components'
import { useNavigation } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { account } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { toShortDateFormat } from '../../../../utils/string'

type FileBackupOverviewProps = {
  next: () => void
}
export const FileBackupOverview = ({ next }: FileBackupOverviewProps): ReactElement => {
  const navigation = useNavigation()

  return (
    <View style={tw`h-full flex-shrink flex flex-col mt-12`}>
      <View style={tw`h-full flex-shrink`}>
        {account.settings.lastBackupDate ? (
          <Text style={tw`text-center text-grey-1`}>
            {i18n('settings.backups.lastBackup')} {toShortDateFormat(new Date(account.settings.lastBackupDate), true)}
          </Text>
        ) : null}
        <Pressable style={tw`mt-2`} onPress={next}>
          <Card>
            <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.backups.createNew')}</Text>
          </Card>
        </Pressable>
      </View>
      <View style={tw`flex items-center mt-16`}>
        <Button title={i18n('back')} wide={false} secondary={true} onPress={navigation.goBack} />
      </View>
    </View>
  )
}
