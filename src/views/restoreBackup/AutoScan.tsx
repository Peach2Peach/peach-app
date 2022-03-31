import React, { ReactElement, useContext } from 'react'
import { Image, View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Text } from '../../components'
import i18n from '../../utils/i18n'


export default (): ReactElement => {
  useContext(LanguageContext)

  return <View style={tw`h-full flex`}>
    <View style={[
      tw`h-full flex-shrink p-8 pt-16 flex-col items-center`,
      tw.md`pt-36`
    ]}>
      <Image source={require('../../../assets/favico/peach-logo.png')}
        style={[tw`h-24`, tw.md`h-32`, { resizeMode: 'contain' }]}
      />
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