import { TxOut } from 'bdk-rn/lib/classes/Bindings'
import { Fragment, useState } from 'react'
import { View } from 'react-native'
import { Checkbox, Header, HorizontalLine, PeachScrollView, Screen } from '../../components'
import { BTCAmount } from '../../components/bitcoin'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useShowHelp } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { getUTXOId } from '../../utils/wallet'
import { useWalletState } from '../../utils/wallet/walletStore'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { UTXOAddress } from './components'
import { useUTXOs } from './hooks/useUTXOs'

export const CoinSelection = () => {
  const storedSelection = useWalletState((state) => state.selectedUTXOIds)
  const [selectedUTXOs, setSelectedUTXOs] = useState(storedSelection)
  const { isLoading } = useUTXOs()

  if (isLoading) {
    return <BitcoinLoading />
  }

  const toggleSelection = (utxoId: string) => {
    setSelectedUTXOs((previousSelection) => {
      if (previousSelection.includes(utxoId)) {
        return previousSelection.filter((selectedUTXO) => selectedUTXO !== utxoId)
      }
      return [...previousSelection, utxoId]
    })
  }

  return (
    <Screen header={<CoinSelectionHeader />}>
      <UTXOList selectedUTXOs={selectedUTXOs} toggleSelection={toggleSelection} />
      <ConfirmButton selectedUTXOIds={selectedUTXOs} />
    </Screen>
  )
}

type UTXOListProps = {
  selectedUTXOs: string[]
  toggleSelection: (utxoId: string) => void
}

function CoinSelectionHeader () {
  const openPopup = useShowHelp('coinControl')
  return (
    <Header
      title={i18n('wallet.coinControl.title')}
      icons={[{ ...headerIcons.help, onPress: openPopup, accessibilityHint: i18n('help') }]}
    />
  )
}

function UTXOList ({ selectedUTXOs, toggleSelection }: UTXOListProps) {
  const { data: utxos } = useUTXOs()

  return (
    <PeachScrollView contentContainerStyle={[tw`grow py-sm`, tw.md`py-md`]} contentStyle={tw`gap-4 grow`}>
      {utxos
        && utxos?.map((utxo, index) => (
          <Fragment key={utxo.txout.script.id}>
            <UTXOItem
              txout={utxo.txout}
              toggleSelection={() => toggleSelection(getUTXOId(utxo))}
              isSelected={selectedUTXOs.findIndex((selectedUTXO) => selectedUTXO === getUTXOId(utxo)) !== -1}
            />
            {index !== utxos.length - 1 && <HorizontalLine />}
          </Fragment>
        ))}
    </PeachScrollView>
  )
}

type UTXOItemProps = {
  txout: TxOut
  isSelected: boolean
  toggleSelection: () => void
}

function UTXOItem ({ txout: { value: amount, script }, isSelected, toggleSelection }: UTXOItemProps) {
  return (
    <View style={tw`flex-row gap-3 px-2`}>
      <View style={tw`flex-1 gap-1`}>
        <BTCAmount size="medium" amount={amount} />
        <UTXOAddress script={script} />
      </View>
      <Checkbox testID="checkbox" onPress={toggleSelection} checked={isSelected} />
    </View>
  )
}

function ConfirmButton ({ selectedUTXOIds }: { selectedUTXOIds: string[] }) {
  const navigation = useNavigation()
  const setSelectedUTXOIds = useWalletState((state) => state.setSelectedUTXOIds)

  const onPress = () => {
    setSelectedUTXOIds(selectedUTXOIds)
    navigation.navigate('sendBitcoin')
  }
  return (
    <Button style={tw`self-center`} onPress={onPress}>
      {i18n('confirm')}
    </Button>
  )
}
