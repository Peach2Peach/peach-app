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

const translationsPath = 'settings.backups.fileBackup.'
export const FileBackupOverview = ({ next }: FileBackupOverviewProps): ReactElement => (
  <View style={tw`items-center h-full`}>
    <Text style={tw`subtitle-1`}>{i18n(translationsPath + 'toRestore')}</Text>
    <View style={tw`items-center justify-center flex-shrink h-full`}>
      {!!account.settings.lastBackupDate && (
        <>
          <Text style={tw`h6`}>{i18n(translationsPath + 'lastBackup')}</Text>
          <Text style={tw`mt-2 mb-8 body-m`}>{toShortDateFormat(new Date(account.settings.lastBackupDate), true)}</Text>
        </>
      )}
      <PrimaryButton onPress={next} iconId="save" wide>
        {i18n(translationsPath + 'createNew')}
      </PrimaryButton>
    </View>
    <GoBackButton style={tw`my-6`} />
  </View>
)
