import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Card, Text } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import { useNavigation } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { account } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { toShortDateFormat } from '../../../../utils/date'

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
        <PrimaryButton narrow onPress={navigation.goBack}>
          {i18n('back')}
        </PrimaryButton>
      </View>
    </View>
  )
}
