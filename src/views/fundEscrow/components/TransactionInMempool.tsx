import { NETWORK } from '@env'
import { useState } from 'react'
import { Image, LayoutChangeEvent, TouchableOpacity, View } from 'react-native'
import txInMempool from '../../../assets/escrow/tx-in-mempool.png'
import { Icon, Text } from '../../../components'
import { TradeInfo } from '../../../components/offer'
import tw from '../../../styles/tailwind'
import { showTransaction } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'

type Props = {
  txId: string
}

export const TransactionInMempool = ({ txId }: Props) => {
  const [width, setWidth] = useState(300)
  const openInExplorer = () => showTransaction(txId, NETWORK)
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)

  return (
    <View style={tw`justify-between h-full`}>
      <View style={tw`justify-center flex-shrink h-full gap-3 px-8`}>
        <Text>{i18n('sell.funding.mempool.description')}</Text>
        <View {...{ onLayout }} testID="image-container">
          <Image source={txInMempool} style={{ width, height: width * 0.7 }} resizeMode="contain" />
        </View>
        <TouchableOpacity onPress={openInExplorer}>
          <TradeInfo
            style={tw`self-center`}
            text={i18n('showInExplorer')}
            textStyle={tw`underline`}
            IconComponent={<Icon id="externalLink" style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}
