import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, Text, Title } from '../../components'
import { PEACHFEE } from '../../constants'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  useContext(LanguageContext)

  return (
    <View style={tw`h-full flex items-stretch pt-6 px-12 pb-10`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.fees.subtitle')} />
      <View style={tw`h-full flex-shrink flex justify-center`}>
        <Text style={tw`text-grey-1`}>
          {i18n('settings.fees.text.1')}
          <Text style={tw`text-peach-1`}> {i18n('settings.fees.text.2', (PEACHFEE * 100).toString())} </Text>
          {i18n('settings.fees.text.3')}
        </Text>
        <Text style={tw`text-grey-1 mt-1`}>{i18n('settings.fees.text.4')}</Text>
      </View>
      <GoBackButton style={tw`flex items-center mt-16`} />
    </View>
  )
}
