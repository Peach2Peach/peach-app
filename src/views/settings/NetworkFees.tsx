import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, HorizontalLine, PeachScrollView, PrimaryButton, RadioButtons, Text } from '../../components'
import { MessageContext } from '../../contexts/message'
import { useValidatedState } from '../../hooks'
import { account, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { updateUser } from '../../utils/peachAPI'
import CustomFeeItem from './components/networkFees/CustomFeeItem'
import EstimatedFeeItem from './components/networkFees/EstimatedFeeItem'
import { useNetworkFeesSetup } from './hooks/useNetworkFeesSetup'

const customFeeRules = {
  required: true,
  feeRate: true,
}

const estimatedFeeRates: FeeRate[] = ['fastestFee', 'halfHourFee', 'hourFee', 'custom']

export default (): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const { estimatedFees } = useNetworkFeesSetup()

  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate>(account.settings.selectedFeeRate || 'halfHourFee')
  const [customFeeRate, setCustomFeeRate, isValid] = useValidatedState<string>(
    (account.settings.customFeeRate || '1').toString(),
    customFeeRules,
  )
  const [feeRateSet, setFeeRateSet] = useState(true)

  const options = estimatedFeeRates.map((feeRate) => ({
    value: feeRate,
    display:
      feeRate === 'custom' ? (
        <CustomFeeItem {...{ customFeeRate, setCustomFeeRate, disabled: selectedFeeRate !== 'custom' }} />
      ) : (
        <EstimatedFeeItem {...{ feeRate, estimatedFees: estimatedFees[feeRate] }} />
      ),
  }))

  const submit = async () => {
    const [result, err] = await updateUser({
      feeRate: selectedFeeRate !== 'custom' ? selectedFeeRate : Number(customFeeRate),
    })
    if (result) {
      updateSettings({
        selectedFeeRate,
        customFeeRate: Number(customFeeRate),
      })
      setFeeRateSet(true)
    } else if (err) {
      updateMessage({
        msgKey: err.error,
        level: 'ERROR',
      })
    }
  }

  useEffect(() => {
    if (!customFeeRate || isNaN(Number(customFeeRate)) || customFeeRate === '0') setCustomFeeRate('1')
  }, [selectedFeeRate, setCustomFeeRate])

  useEffect(() => {
    setFeeRateSet(
      account.settings.selectedFeeRate === selectedFeeRate && account.settings.customFeeRate === Number(customFeeRate),
    )
  }, [customFeeRate, selectedFeeRate, setCustomFeeRate])

  return (
    <View style={tw`flex-1`}>
      <PeachScrollView contentContainerStyle={tw`flex-1 justify-center p-8`}>
        <RadioButtons
          {...{
            items: options,
            selectedValue: selectedFeeRate,
            onChange: setSelectedFeeRate,
          }}
        />
        <HorizontalLine style={tw`mt-8 bg-black-5`} />
        <Text style={tw`text-center text-black-2 mt-4`}>{i18n('settings.networkFees.averageFees')}</Text>
        <Text style={tw`subtitle-1 text-center`}>
          {i18n('settings.networkFees.xSatsPerByte', estimatedFees.economyFee.toString())}
        </Text>
      </PeachScrollView>
      <PrimaryButton onPress={submit} disabled={!isValid || feeRateSet} style={tw`m-8 self-center`}>
        {i18n(feeRateSet ? 'settings.networkFees.feeRateSet' : 'confirm')}
      </PrimaryButton>
    </View>
  )
}
