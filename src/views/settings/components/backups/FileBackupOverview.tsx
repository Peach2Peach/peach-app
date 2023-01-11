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
  <View style={tw`h-full items-center`}>
    <Text style={tw`subtitle-1`}>{i18n(translationsPath + 'toRestore')}</Text>
    <View style={tw`h-full flex-shrink justify-center items-center`}>
      {!!account.settings.lastBackupDate && (
        <>
          <Text style={tw`h6`}>{i18n(translationsPath + 'lastBackup')}</Text>
          <Text style={tw`text-center text-grey-1`}>
            {toShortDateFormat(new Date(account.settings.lastBackupDate), true)}
          </Text>
        </>
      )}
      <PrimaryButton style={tw`mt-4`} onPress={next} iconId="save" wide>
        {i18n(translationsPath + 'createNew')}
      </PrimaryButton>
    </View>
    <GoBackButton style={tw`my-6`} />
  </View>
)
