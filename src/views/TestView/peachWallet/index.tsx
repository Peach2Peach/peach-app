import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { BigSatsFormat, Loading, PrimaryButton, Text } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { peachWallet } from '../../../utils/wallet/setWallet'
import i18n from '../../../utils/i18n'
import { useWalletSetup } from '../../wallet/hooks/useWalletSetup'
import { BitcoinAddressInput } from '../../../components/inputs'
import { showTransaction } from '../../../utils/bitcoin'
import { NETWORK } from '@env'

export default () => {
  const { walletStore, isRefreshing, walletLoading, address, setAddress, isValid, addressErrors } = useWalletSetup()
  useHeaderSetup(useMemo(() => ({ title: 'test view - peach wallet' }), []))
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

  return (
    <View style={tw`p-10 gap-4`}>
      <Text style={tw`mb-4 button-medium`}>{i18n('wallet.totalBalance')}:</Text>
      <BigSatsFormat style={isRefreshing ? tw`opacity-60` : {}} sats={walletStore.balance} />
      {(isRefreshing || walletLoading) && <Loading style={tw`absolute`} />}

      <View>
        <Text style={tw`mt-16 button-medium`}>{i18n('wallet.withdrawTo')}:</Text>
        <BitcoinAddressInput
          style={tw`mt-4`}
          {...{
            onChange: setAddress,
            isValid,
            value: address,
            errorMessage: addressErrors,
          }}
        />
      </View>
      <PrimaryButton onPress={getNewAddress}>Get new address</PrimaryButton>
      <PrimaryButton onPress={send50k}>Send 50k sats</PrimaryButton>
      {!!txId && (
        <View>
          <Text onPress={() => showTransaction(txId, NETWORK)}>txId: {txId}</Text>
        </View>
      )}
    </View>
  )
}
