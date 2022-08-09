import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import { Text } from '../../components'
import i18n from '../../utils/i18n'
import Logo from '../../assets/logo/peachLogo.svg'

export default (): ReactElement => {
  useContext(LanguageContext)

  return <View style={tw`h-full flex`}>
    <View style={[
      tw`h-full flex-shrink p-6 pt-32 flex-col items-center`,
      tw.md`pt-36`
    ]}>
      <View style={tw`h-full flex-shrink flex-col items-center justify-end`}>
        <Logo style={[tw`flex-shrink max-w-full w-96 max-h-96 h-full`, { minHeight: 48 }]} />
      </View>
      <View style={[tw`mt-11 w-full`, tw.md`mt-14`]}>
        <Text style={tw`font-baloo text-center text-3xl leading-3xl text-peach-1`}>
          {i18n('restoreBackup')}
        </Text>
        <Text style={tw`mt-4 text-center`}>
          {i18n('restoreBackup.autoScan.description.1')}
        </Text>
        <Text style={tw`mt-3 text-center`}>
          {i18n('restoreBackup.autoScan.description.2')}
        </Text>
      </View>
    </View>
  </View>
}