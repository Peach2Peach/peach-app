import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Title } from '../../components'
import SaveAccount from '../../overlays/info/SaveAccount'
import i18n from '../../utils/i18n'
import FileBackup from './components/backups/FileBackup'

export default (): ReactElement => (
  <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
    <Title title={i18n('settings.title')} subtitle={i18n('settings.backups.subtitle')} help={<SaveAccount />} />
    <FileBackup />
  </View>
)
