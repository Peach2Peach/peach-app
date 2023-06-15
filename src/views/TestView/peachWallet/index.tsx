import { NETWORK } from '@env'
import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { BigSatsFormat, Divider, Loading, PeachScrollView, PrimaryButton, Text } from '../../../components'
import { BitcoinAddressInput, NumberInput } from '../../../components/inputs'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { showTransaction } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { fundAddress } from '../../../utils/regtest'
import { thousands } from '../../../utils/string'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletSetup } from '../../wallet/hooks/useWalletSetup'
import { BTCAmount } from '../../../components/bitcoin'

export default () => {
  const { walletStore, isRefreshing, walletLoading, address, setAddress, isValid, addressErrors } = useWalletSetup(false)
  useHeaderSetup(useMemo(() => ({ title: 'test view - peach wallet' }), []))
  const [amount, setAmount] = useState('0')
  const [txId, setTxId] = useState('')
  const getNewAddress = async () => {
    const newAddress = await peachWallet.getReceivingAddress()
    setAddress(newAddress.address)
  }
  const send50k = async () => {
    if (!isValid || !address) throw Error('Address invalid')
    const transactionDetails = await peachWallet.sendTo(address, 50000, 3)

    if (!transactionDetails) throw Error('Transaction failed')
    setTxId(transactionDetails.txDetails.txid)
  }
  const refill = async () => {
    const { address: newAddress } = await peachWallet.getReceivingAddress()
    fundAddress({ address: newAddress, amount: 1000000 })
  }

  return (
    <PeachScrollView>
      <View style={tw`p-10 gap-4`}>
        <Text style={tw`text-center button-medium`}>{i18n('wallet.totalBalance')}:</Text>
        <BTCAmount
          style={[tw`self-center`, isRefreshing ? tw`opacity-60` : {}]}
          amount={walletStore.balance}
          size="extra large"
        />
        {(isRefreshing || walletLoading) && <Loading style={tw`absolute`} />}

        <View>
          <Text style={tw`button-medium`}>{i18n('wallet.withdrawTo')}:</Text>
          <BitcoinAddressInput
            style={tw`mt-4`}
            {...{
              onChange: setAddress,
              isValid,
              value: address,
              errorMessage: addressErrors,
            }}
          />
          <NumberInput
            {...{
              onChange: setAmount,
              isValid: true,
              value: amount,
            }}
          />
        </View>
        <PrimaryButton onPress={send50k} iconId="upload">
          send {thousands(Number(amount))} sats
        </PrimaryButton>
        {!!txId && (
          <View>
            <Text onPress={() => showTransaction(txId, NETWORK)}>txId: {txId}</Text>
          </View>
        )}

        <Divider />
        <PrimaryButton onPress={getNewAddress} iconId="refreshCcw">
          get new address
        </PrimaryButton>
        <PrimaryButton onPress={refill} iconId="star">
          1M sats refill
        </PrimaryButton>

        <Divider />
        <PrimaryButton onPress={peachWallet.syncWallet} iconId="refreshCcw">
          sync wallet
        </PrimaryButton>
      </View>
    </PeachScrollView>
  )
}
