import { NETWORK } from '@env'
import { useState } from 'react'
import { View } from 'react-native'
import { Divider, Loading, PeachScrollView, PrimaryButton, Text } from '../../../components'
import { BTCAmount } from '../../../components/bitcoin'
import { BitcoinAddressInput, NumberInput } from '../../../components/inputs'
import { useValidatedState } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { showTransaction } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { fundAddress } from '../../../utils/regtest'
import { thousands } from '../../../utils/string'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useSyncWallet } from '../../wallet/hooks/useSyncWallet'
import { useWalletSetup } from '../../wallet/hooks/useWalletSetup'

const bitcoinAddressRules = { required: false, bitcoinAddress: true }
const useTestViewWalletSetup = () => {
  const { balance, isRefreshing, walletLoading } = useWalletSetup({ peachWallet, syncOnLoad: false })

  const [address, setAddress, , addressErrors] = useValidatedState<string>('', bitcoinAddressRules)

  return {
    balance,
    isRefreshing,
    walletLoading,
    address,
    setAddress,
    addressErrors,
  }
}

export const TestViewPeachWallet = () => {
  const { balance, isRefreshing, walletLoading, address, setAddress, addressErrors } = useTestViewWalletSetup()
  const { refresh } = useSyncWallet()

  const [amount, setAmount] = useState('0')
  const [txId, setTxId] = useState('')
  const getNewAddress = async () => {
    const newAddress = await peachWallet.getReceivingAddress()
    setAddress(newAddress.address)
  }
  const send = async () => {
    if (!address) throw Error('Address invalid')
    const result = await peachWallet.sendTo({ address, amount: 50000, feeRate: 3 })
    setTxId(await result.txid())
  }
  const refill = async () => {
    const { address: newAddress } = await peachWallet.getReceivingAddress()
    fundAddress({ address: newAddress, amount: 1000000 })
  }

  return (
    <PeachScrollView>
      <View style={tw`gap-4 p-10`}>
        <Text style={tw`text-center button-medium`}>{i18n('wallet.totalBalance')}:</Text>
        <BTCAmount style={[tw`self-center`, isRefreshing ? tw`opacity-60` : {}]} amount={balance} size="extra large" />
        {(isRefreshing || walletLoading) && <Loading style={tw`absolute`} />}

        <View>
          <Text style={tw`button-medium`}>{i18n('wallet.withdrawTo')}:</Text>
          <BitcoinAddressInput style={tw`mt-4`} onChange={setAddress} value={address} errorMessage={addressErrors} />
          <NumberInput onChange={setAmount} value={amount} />
        </View>
        <PrimaryButton onPress={send} iconId="upload">
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
        <PrimaryButton onPress={refresh} iconId="refreshCcw">
          sync wallet
        </PrimaryButton>
      </View>
    </PeachScrollView>
  )
}
