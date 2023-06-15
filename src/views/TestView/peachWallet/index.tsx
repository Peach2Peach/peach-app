import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { BigSatsFormat, Divider, Loading, PrimaryButton, Text } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { peachWallet } from '../../../utils/wallet/setWallet'
import i18n from '../../../utils/i18n'
import { useWalletSetup } from '../../wallet/hooks/useWalletSetup'
import { BitcoinAddressInput, NumberInput } from '../../../components/inputs'
import { showTransaction } from '../../../utils/bitcoin'
import { NETWORK } from '@env'
import { BTCAmount } from '../../../components/bitcoin'
import { thousands } from '../../../utils/string'
import { fundAddress } from '../../../utils/regtest'

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
    peachWallet.syncWallet()
  }
  const refill = async () => {
    const { address: newAddress } = await peachWallet.getReceivingAddress()
    fundAddress({ address: newAddress, amount: 1000000 })
    peachWallet.syncWallet()
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
      <NumberInput
        {...{
          onChange: setAmount,
          isValid: true,
          value: amount,
        }}
      />
      <PrimaryButton onPress={send50k} iconId="upload">
        Send {thousands(Number(amount))} sats
      </PrimaryButton>
      {!!txId && (
        <View>
          <Text onPress={() => showTransaction(txId, NETWORK)}>txId: {txId}</Text>
        </View>
      )}

      <Divider />
      <PrimaryButton onPress={getNewAddress} iconId="refreshCcw">
        Get new address
      </PrimaryButton>
      <PrimaryButton onPress={refill} iconId="star">
        1M sats refill
      </PrimaryButton>
    </View>
  )
}
