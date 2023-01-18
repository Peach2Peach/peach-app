import React, { ReactElement, useState } from 'react'
import { Image, LayoutChangeEvent, View } from 'react-native'
import txInMempool from '../../../assets/escrow/tx-in-mempool.png'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export default (): ReactElement => {
  const [width, setWidth] = useState(300)

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)
  return (
    <View style={tw`justify-center h-full px-8`}>
      <Text>{i18n('sell.funding.mempool.description')}</Text>
      <View style={tw`mt-3`} {...{ onLayout }}>
        <Image source={txInMempool} style={{ width, height: width * 0.7 }} resizeMode="contain" />
      </View>
    </View>
  )
}
