import { useMemo, useState } from 'react'
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'
import { HorizontalLine, NewHeader, PeachScrollView, Screen, Text } from '../../components'
import { BitcoinAddressInput, ConfirmSlider, RadioButtons } from '../../components/inputs'
import { useNavigation } from '../../hooks'
import { useFeeEstimate } from '../../hooks/query/useFeeEstimate'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import { enforceDecimalsFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'
import { isBitcoinAddress } from '../../utils/validation'
import { peachWallet } from '../../utils/wallet/setWallet'
import { CustomFeeItem } from '../settings/components/networkFees/CustomFeeItem'
import { EstimatedFeeItem } from '../settings/components/networkFees/EstimatedFeeItem'
import { useOpenWithdrawalConfirmationPopup } from './hooks/useOpenWithdrawalConfirmationPopup'

export const SendBitcoin = () => {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [feeRate, setFee] = useState<number>()
  const openConfirmationPopup = useOpenWithdrawalConfirmationPopup()
  const closePopup = usePopupStore((state) => state.closePopup)
  const { estimatedFees } = useFeeEstimate()

  const navigation = useNavigation()

  const enforceFormat = (text: string) => {
    if (text === '') {
      setAmount('')
      return
    }
    const value = Number(text.replace(/[^0-9]/gu, ''))
    const newValue = value > peachWallet.balance ? peachWallet.balance : value
    const formatted = thousands(Number(enforceDecimalsFormat(String(newValue), 0)))
    setAmount(formatted)
  }

  const onSuccess = () => {
    closePopup()
    navigation.navigate('transactionHistory')
  }

  const sendTrasaction = () => {
    openConfirmationPopup({
      address,
      amount: Number(amount.replace(/[^0-9]/gu, '')),
      feeRate: feeRate || Number(estimatedFees.fastestFee),
      onSuccess,
    })
  }

  const isFormValid = useMemo(() => isBitcoinAddress(address) && amount !== '', [address, amount])

  return (
    <Screen>
      <NewHeader title={i18n('wallet.sendBitcoin.title')} />
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
                setAmount(thousands(peachWallet.balance))
              },
            }}
          >
            <AmountInput value={amount} onChangeText={enforceFormat} />
          </Section>

          <HorizontalLine />

          <Section title={i18n('wallet.sendBitcoin.fee')}>
            <Fees updateFee={setFee} />
          </Section>
        </View>

        <ConfirmSlider label1={i18n('wallet.sendBitcoin.send')} onConfirm={sendTrasaction} enabled={isFormValid} />
      </PeachScrollView>
    </Screen>
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

function AmountInput (props: TextInputProps) {
  return (
    <View style={tw`flex-row items-center gap-1 border rounded-xl px-3 mb-4`}>
      <TextInput
        placeholder="000 000 000"
        style={[tw`h-10 py-0 input-text`]}
        placeholderTextColor={tw`text-black-5`.color}
        keyboardType={'numeric'}
        {...props}
      />
      <Text style={tw`input-text`}>{i18n('sat')}</Text>
    </View>
  )
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

function Fees ({ updateFee }: { updateFee: (fee: number) => void }) {
  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate>('fastestFee')
  const [customFeeRate, setCustomFeeRate] = useState<string | undefined>(undefined)
  const { estimatedFees } = useFeeEstimate()

  const onFeeRateChange = (feeRate: FeeRate) => {
    updateFee(feeRate === 'custom' ? Number(customFeeRate) : estimatedFees[feeRate])
  }

  const updateCustomFeeRate = (feeRate: string) => {
    setCustomFeeRate(feeRate)
    updateFee(Number(feeRate))
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
