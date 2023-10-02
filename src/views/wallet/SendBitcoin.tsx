import { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { NewHeader as Header, HorizontalLine, PeachScrollView, Screen, Text } from '../../components'
import { BitcoinAddressInput, ConfirmSlider, RadioButtons } from '../../components/inputs'
import { BTCAmountInput } from '../../components/inputs/BTCAmountInput'
import { useNavigation, useShowHelp } from '../../hooks'
import { useFeeEstimate } from '../../hooks/query/useFeeEstimate'
import tw from '../../styles/tailwind'
import { removeNonDigits } from '../../utils/format/removeNonDigits'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { isBitcoinAddress } from '../../utils/validation'
import { getNetwork } from '../../utils/wallet'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useWalletState } from '../../utils/wallet/walletStore'
import { CustomFeeItem } from '../settings/components/networkFees/CustomFeeItem'
import { EstimatedFeeItem } from '../settings/components/networkFees/EstimatedFeeItem'
import { UTXOAddress } from './components'
import { useUTXOs } from './hooks'
import { useOpenWithdrawalConfirmationPopup } from './hooks/useOpenWithdrawalConfirmationPopup'

export const SendBitcoin = () => {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState(0)
  const [shouldDrainWallet, setShouldDrainWallet] = useState(false)
  const { estimatedFees } = useFeeEstimate()
  const [feeRate, setFee] = useState<number | undefined>(estimatedFees.fastestFee)
  const openConfirmationPopup = useOpenWithdrawalConfirmationPopup()

  const { selectedUTXOs } = useUTXOs()

  const maxAmount = selectedUTXOs.length
    ? selectedUTXOs.reduce((acc, utxo) => acc + utxo.txout.value, 0)
    : peachWallet.balance

  const onAmountChange = (newText: string) => {
    setShouldDrainWallet(false)
    const newNumber = Number(removeNonDigits(newText) || '0')
    const newValue = Math.min(newNumber, maxAmount)
    setAmount(newValue)
  }

  const sendTrasaction = () => {
    if (!feeRate) return
    openConfirmationPopup({
      address,
      amount,
      feeRate,
      shouldDrainWallet,
      utxos: selectedUTXOs,
    })
  }

  const isFormValid = useMemo(
    () => isBitcoinAddress(address, getNetwork()) && amount !== 0 && !!feeRate,
    [address, amount, feeRate],
  )

  return (
    <Screen>
      <SendBitcoinHeader />
      <PeachScrollView contentContainerStyle={[tw`grow py-sm`, tw.md`py-md`]}>
        <View style={[tw`pb-11 gap-4`, tw.md`pb-14`]}>
          <Section title={i18n('wallet.sendBitcoin.to')}>
            <BitcoinAddressInput value={address} onChange={setAddress} />
          </Section>

          <HorizontalLine />

          <Section
            title={i18n('wallet.sendBitcoin.amount')}
            action={{
              label: i18n('wallet.sendBitcoin.sendMax'),
              onPress: () => {
                setShouldDrainWallet(true)
                setAmount(maxAmount)
              },
            }}
          >
            <BTCAmountInput amount={amount} onChangeText={onAmountChange} />
          </Section>

          <HorizontalLine />

          <Section title={i18n('wallet.sendBitcoin.fee')}>
            <Fees updateFee={setFee} />
          </Section>

          <SelectedUTXOs />
        </View>

        <SendBitcoinSlider onConfirm={sendTrasaction} isFormValid={isFormValid} />
      </PeachScrollView>
    </Screen>
  )
}

function SendBitcoinSlider ({ onConfirm, isFormValid }: { onConfirm: () => void; isFormValid: boolean }) {
  const isSynced = useWalletState((state) => state.isSynced)

  return (
    <ConfirmSlider label1={i18n('wallet.sendBitcoin.send')} onConfirm={onConfirm} enabled={isFormValid && isSynced} />
  )
}

type SectionProps = {
  title?: string
  action?: {
    onPress: () => void
    label: string
  }
  children: React.ReactNode
}
function Section ({ title, action, children }: SectionProps) {
  return (
    <View style={tw``}>
      <View style={tw`flex-row items-center justify-between px-10px`}>
        <Text style={tw`input-title`}>{title}</Text>
        {action && (
          <TouchableOpacity onPress={action.onPress}>
            <Text style={tw`text-primary-main`}>{action.label}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={tw``}>{children}</View>
    </View>
  )
}

const feeRates: FeeRate[] = ['fastestFee', 'halfHourFee', 'hourFee', 'custom']

function Fees ({ updateFee }: { updateFee: (fee: number | undefined) => void }) {
  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate>('fastestFee')
  const [customFeeRate, setCustomFeeRate] = useState('')
  const { estimatedFees } = useFeeEstimate()

  const onFeeRateChange = (feeRate: FeeRate) => {
    updateFee(feeRate === 'custom' ? (customFeeRate === '' ? undefined : Number(customFeeRate)) : estimatedFees[feeRate])
  }

  const updateCustomFeeRate = (feeRate: string) => {
    setCustomFeeRate(feeRate)
    updateFee(feeRate === '' ? undefined : Number(feeRate))
  }

  const onButtonPress = (feeRate: FeeRate) => {
    setSelectedFeeRate(feeRate)
    onFeeRateChange(feeRate)
  }

  const options = feeRates.map((feeRate) => ({
    value: feeRate,
    display:
      feeRate === 'custom' ? (
        <CustomFeeItem
          customFeeRate={customFeeRate}
          setCustomFeeRate={updateCustomFeeRate}
          disabled={selectedFeeRate !== 'custom'}
        />
      ) : (
        <EstimatedFeeItem feeRate={feeRate} estimatedFees={estimatedFees[feeRate]} />
      ),
  }))

  return <RadioButtons items={options} selectedValue={selectedFeeRate} onButtonPress={onButtonPress} />
}

function SendBitcoinHeader () {
  const openPopup = useShowHelp('withdrawingFunds')
  const navigation = useNavigation()
  return (
    <Header
      title={i18n('wallet.sendBitcoin.title')}
      icons={[
        {
          ...headerIcons.listFlipped,
          onPress: () => navigation.navigate('coinSelection'),
          accessibilityHint: `${i18n('goTo')} ${i18n('wallet.coinControl.title')}`,
        },
        {
          ...headerIcons.help,
          onPress: openPopup,
          accessibilityHint: i18n('help'),
        },
      ]}
    />
  )
}

function SelectedUTXOs () {
  const { selectedUTXOs } = useUTXOs()
  if (selectedUTXOs.length === 0) return null

  return (
    <>
      <HorizontalLine />
      <Section title={i18n('wallet.sendBitcoin.sendingFrom.coins')}>
        <View style={tw`px-10px`}>
          {selectedUTXOs.map(({ txout: { script } }) => (
            <UTXOAddress key={script.id} script={script} />
          ))}
        </View>
      </Section>
    </>
  )
}
