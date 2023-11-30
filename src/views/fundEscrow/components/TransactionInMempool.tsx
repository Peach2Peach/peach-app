import { NETWORK } from '@env'
import { networks } from 'bitcoinjs-lib'
import { useMemo, useState } from 'react'
import { Image, LayoutChangeEvent, TouchableOpacity, View } from 'react-native'
import txInMempool from '../../../assets/escrow/tx-in-mempool.png'
import { Header, Icon, Screen, Text } from '../../../components'
import { TradeInfo } from '../../../components/offer'
import { useShowHelp } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { showTransaction } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout'
import { generateBlock } from '../../../utils/regtest'
import { getNetwork } from '../../../utils/wallet'

type Props = {
  txId: string
}

export const TransactionInMempool = ({ txId }: Props) => {
  const [width, setWidth] = useState(300)
  const openInExplorer = () => showTransaction(txId, NETWORK)
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)

  return (
    <Screen header={<MempoolHeader />}>
      <View style={tw`justify-center gap-3 grow shrink`}>
        <Text>{i18n('sell.funding.mempool.description')}</Text>
        <View {...{ onLayout }} testID="image-container">
          <Image source={txInMempool} style={{ width, height: width * 0.7 }} resizeMode="contain" />
        </View>
        <TouchableOpacity onPress={openInExplorer}>
          <TradeInfo
            style={tw`self-center`}
            text={i18n('showInExplorer')}
            textStyle={tw`underline`}
            IconComponent={<Icon id="externalLink" style={tw`w-5 h-5`} color={tw.color('primary-main')} />}
          />
        </TouchableOpacity>
      </View>
    </Screen>
  )
}

function MempoolHeader () {
  const showHelp = useShowHelp('mempool')

  const memoizedHeaderIcons = useMemo(() => {
    const icons = [{ ...headerIcons.help, onPress: showHelp }]
    if (getNetwork() === networks.regtest) {
      icons.unshift({ ...headerIcons.generateBlock, onPress: generateBlock })
    }
    return icons
  }, [showHelp])

  return <Header title={i18n('sell.funding.mempool.title')} icons={memoizedHeaderIcons} />
}
