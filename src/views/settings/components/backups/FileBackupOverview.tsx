import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../../../components'
import { GoBackButton, PrimaryButton } from '../../../../components/buttons'
import tw from '../../../../styles/tailwind'
import { account } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { toShortDateFormat } from '../../../../utils/date'

type FileBackupOverviewProps = {
  next: () => void
}
export const FileBackupOverview = ({ next }: FileBackupOverviewProps): ReactElement => (
  <View style={tw`h-full flex-shrink flex flex-col mt-12 items-center`}>
    <View style={tw`h-full flex-shrink`}>
      {!!account.settings.lastBackupDate && (
        <Text style={tw`text-center text-grey-1`}>
          {i18n('settings.backups.lastBackup')} {toShortDateFormat(new Date(account.settings.lastBackupDate), true)}
        </Text>
      )}
      <PrimaryButton style={tw`mt-4`} onPress={next} iconId="save" wide>
        {i18n('settings.backups.createNew')}
      </PrimaryButton>
    </View>
    <GoBackButton style={tw`mb-6`} />
  </View>
)
