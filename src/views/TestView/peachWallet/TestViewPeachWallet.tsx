import { NETWORK } from '@env'
import { useState } from 'react'
import { View } from 'react-native'
import Share from 'react-native-share'
import { Divider } from '../../../components/Divider'
import { PeachScrollView } from '../../../components/PeachScrollView'
import { Screen } from '../../../components/Screen'
import { Loading } from '../../../components/animation/Loading'
import { BTCAmount } from '../../../components/bitcoin/BTCAmount'
import { Button } from '../../../components/buttons/Button'
import { BitcoinAddressInput } from '../../../components/inputs/BitcoinAddressInput'
import { Input } from '../../../components/inputs/Input'
import { NumberInput } from '../../../components/inputs/NumberInput'
import { PeachText } from '../../../components/text/PeachText'
import { CopyAble } from '../../../components/ui/CopyAble'
import { useValidatedState } from '../../../hooks/useValidatedState'
import tw from '../../../styles/tailwind'
import { useAccountStore } from '../../../utils/account/account'
import { getMessageToSignForAddress } from '../../../utils/account/getMessageToSignForAddress'
import { showTransaction } from '../../../utils/bitcoin/showTransaction'
import i18n from '../../../utils/i18n'
import { log } from '../../../utils/log/log'
import { fundAddress } from '../../../utils/regtest/fundAddress'
import { thousands } from '../../../utils/string/thousands'
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
  const { refetch: refresh } = useSyncWallet()

  const [amount, setAmount] = useState('0')
  const [txId, setTxId] = useState('')
  const getNewAddress = async () => {
    const newAddress = await peachWallet.getAddress()
    setAddress(newAddress.address)
  }
  const getNewInternalAddress = async () => {
    const newAddress = await peachWallet.getInternalAddress()
    setAddress(newAddress.address)
  }
  const send = async () => {
    if (!address) throw Error('Address invalid')
    const result = await peachWallet.sendTo({ address, amount: 50000, feeRate: 3 })
    setTxId(await result.txid())
  }
  const refill = async () => {
    const { address: newAddress } = await peachWallet.getAddress()
    fundAddress({ address: newAddress, amount: 1000000 })
  }

  return (
    <Screen>
      <PeachScrollView>
        <View style={tw`gap-4`}>
          <PeachText style={tw`text-center button-medium`}>{i18n('wallet.totalBalance')}:</PeachText>
          <BTCAmount style={[tw`self-center`, isRefreshing ? tw`opacity-60` : {}]} amount={balance} size="large" />
          {(isRefreshing || walletLoading) && <Loading style={tw`absolute`} />}

          <View>
            <PeachText style={tw`button-medium`}>{i18n('wallet.withdrawTo')}:</PeachText>
            <BitcoinAddressInput
              style={tw`mt-4`}
              onChangeText={setAddress}
              value={address}
              errorMessage={addressErrors}
            />
            <NumberInput onChangeText={setAmount} value={amount} />
          </View>
          <Button onPress={send} iconId="upload">
            send {thousands(Number(amount))} sats
          </Button>
          {!!txId && (
            <View>
              <PeachText onPress={() => showTransaction(txId, NETWORK)}>txId: {txId}</PeachText>
            </View>
          )}

          <Divider />
          <Button onPress={getNewAddress} iconId="refreshCcw">
            get new address
          </Button>
          <Button onPress={getNewInternalAddress} iconId="refreshCcw">
            get new internal address
          </Button>
          <Button onPress={refill} iconId="star">
            1M sats refill
          </Button>

          <Divider />
          <Button onPress={() => refresh()} iconId="refreshCcw">
            sync wallet
          </Button>

          <SignMessage />
        </View>
      </PeachScrollView>
    </Screen>
  )
}

function SignMessage () {
  const defaultUserId = useAccountStore((state) => state.account.publicKey)
  const [userId, setUserId] = useState(defaultUserId)
  const [address, setAddress] = useState('')
  const [signature, setSignature] = useState('')
  const onPress = async () => {
    const message = getMessageToSignForAddress(userId, address)
    const sig = await peachWallet.signMessage(message, address)
    setSignature(sig)
  }

  const shareSignature = () => {
    Share.open({ message: signature }).catch((e) => log(e))
  }

  return (
    <View>
      <BitcoinAddressInput label="address" onChangeText={setAddress} value={address} />
      <Input label="userID" required={false} onChangeText={setUserId} value={userId} />
      <Button onPress={onPress}>sign</Button>
      <PeachText>signature</PeachText>
      <View style={tw`flex-row items-center flex-1 gap-4 px-4`}>
        <PeachText style={tw`shrink`} selectable onLongPress={shareSignature}>
          {signature}
        </PeachText>
        {!!signature && <CopyAble value={signature} />}
      </View>
    </View>
  )
}
