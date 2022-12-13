import React, { Fragment, ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Headline, PeachScrollView } from '../../components'
import i18n from '../../utils/i18n'
import { SettingsItem } from './components/SettingsItem'
import { VersionInfo } from './components/VersionInfo'
import { useSettingsSetup } from './useSettingsSetup'

export default (): ReactElement => {
  const settings = useSettingsSetup()

  return (
    <View style={tw`h-full pb-10`}>
      <PeachScrollView contentContainerStyle={tw`pt-6 px-12`}>
        {settings.map(({ headline, items }) => (
          <Fragment key={`settings-${headline}`}>
            {headline && (
              <Headline style={tw`text-center text-lg text-peach-mild mt-8`}>{i18n(`settings.${headline}`)}</Headline>
            )}
            {items.map((item, i) => (
              <SettingsItem key={`${headline}-${item.title}-${i}`} {...item} />
            ))}
          </Fragment>
        ))}
        <VersionInfo />
      </PeachScrollView>
    </View>
  )
}
