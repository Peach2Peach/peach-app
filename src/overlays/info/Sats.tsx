import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, Text } from '../../components'
import i18n from '../../utils/i18n'
import { useConfigStore } from '../../store/configStore'

type SatsInfoProps = {
  view: 'buyer' | 'seller'
}

export default ({ view }: SatsInfoProps): ReactElement => {
  const peachFee = useConfigStore((state) => state.peachFee)

  return (
    <View>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('help.sats.title')}</Headline>
      <View style={tw`flex items-center justify-center`}>
        <Text style={tw`font-bold text-center text-white-1`}>{i18n('help.sats.description.1')}</Text>
        <Text style={tw`mt-2 text-center text-white-1`}>{i18n('help.sats.description.2')}</Text>
        <Text style={tw`mt-6 font-bold text-center text-white-1`}>{i18n('help.sats.description.3')}</Text>
        <Text style={tw`mt-6 text-center text-white-1`}>{i18n(`help.sats.fees.${view}`, String(peachFee * 100))}</Text>
      </View>
    </View>
  )
}
