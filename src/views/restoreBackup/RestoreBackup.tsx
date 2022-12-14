import React, { ReactElement, useMemo, useState } from 'react'

import { View } from 'react-native'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getHeaderIcons } from './getHeaderIcons'
import RestoreFromFile from './RestoreFromFile'
import RestoreFromSeed from './RestoreFromSeed'

const tabs: TabbedNavigationItem[] = [
  {
    id: 'fileBackup',
    display: i18n('settings.backups.fileBackup'),
    view: RestoreFromFile,
  },
  {
    id: 'seedPhrase',
    display: i18n('settings.backups.seedPhrase'),
    view: RestoreFromSeed,
  },
]

export default (): ReactElement => {
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('restoreBackup.title'),
        icons: getHeaderIcons(),
        theme: 'inverted',
      }),
      [],
    ),
  )

  const [currentTab, setCurrentTab] = useState(tabs[0])
  const CurrentView = currentTab.view

  return (
    <View style={tw`h-full`}>
      <View style={tw`h-full flex flex-col pt-5`}>
        <TabbedNavigation theme="inverted" items={tabs} selected={currentTab} select={setCurrentTab} />
        <CurrentView style={tw`h-full flex-shrink`} />
      </View>
    </View>
  )
}
