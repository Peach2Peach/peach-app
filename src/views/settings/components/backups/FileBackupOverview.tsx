import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import tw from '../../../../styles/tailwind'
import { toShortDateFormat } from '../../../../utils/date'
import i18n from '../../../../utils/i18n'
import { useFileBackupOverviewSetup } from '../../hooks/useFileBackupOverviewSetup'

type FileBackupOverviewProps = { next: () => void }

export const FileBackupOverview = ({ next }: FileBackupOverviewProps): ReactElement => {
  const { lastBackupDate } = useFileBackupOverviewSetup()
  return (
    <View style={tw`items-center h-full`}>
      <Text style={tw`subtitle-1`}>{i18n('settings.backups.fileBackup.toRestore')}</Text>
      <View style={tw`items-center justify-center flex-shrink h-full`}>
        {!!lastBackupDate && (
          <>
            <Text style={tw`h6`}>{i18n('settings.backups.fileBackup.lastBackup')}</Text>
            <Text style={tw`mt-2 mb-8 body-m`}>{toShortDateFormat(new Date(lastBackupDate), true)}</Text>
          </>
        )}
        <PrimaryButton onPress={next} iconId="save" wide>
          {i18n('settings.backups.fileBackup.createNew')}
        </PrimaryButton>
      </View>
    </View>
  )
}
