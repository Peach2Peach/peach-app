import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { IconButton, Input, ScanQR, Text, Title } from '../../components'
import { getMessages, rules } from '../../utils/validation'
import Clipboard from '@react-native-clipboard/clipboard'
import Icon from '../../components/Icon'
import { cutOffAddress } from '../../utils/string'
import { parseBitcoinRequest } from '../../utils/bitcoin'

const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)

  let $address: any
  const [address, setAddress] = useState(offer.returnAddress)
  const [shortAddress, setShortAddress] = useState(offer.returnAddress ? cutOffAddress(offer.returnAddress) : '')
  const [focused, setFocused] = useState(false)
  const [useDepositAddress, setUseDepositAddress] = useState(!offer.returnAddress)
  const [scanQR, setScanQR] = useState(false)

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { address },
    rules,
    messages: getMessages()
  })

  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString()
    const request = parseBitcoinRequest(clipboard)
    setAddress(request.address || clipboard)
  }

  useEffect(() => {
    if (useDepositAddress) return
    if (!address) {
      setStepValid(false)
      return
    }

    setShortAddress(cutOffAddress(address || ''))

    validate({
      address: {
        required: true,
        bitcoinAddress: true
      }
    })

    if (!isFormValid()) {
      setStepValid(false)
      return
    }

    setStepValid(true)

    updateOffer({
      ...offer,
      returnAddress: address,
    })
  }, [address, useDepositAddress])

  useEffect(() => {
    if (useDepositAddress) {
      $address.blur()
      setFocused(!useDepositAddress)
      setStepValid(true)
    }
  }, [useDepositAddress])

  return <View style={tw`h-full flex-col justify-between`}>
    <Title title={i18n('sell.title')} subtitle={i18n('sell.returnAddress.subtitle')} help={<Text>TODO</Text>} />
    <View>
      <View pointerEvents={useDepositAddress ? 'none' : 'auto'}
        style={[
          tw`flex-row`,
          useDepositAddress ? tw`opacity-50 pointer-events-none` : {}
        ]}>
        <View style={tw`w-full flex-shrink mr-2`}>
          <Input reference={(el: any) => $address = el}
            value={focused ? address : shortAddress}
            style={tw`pl-4 pr-8`}
            onChange={(value: string) => focused ? setAddress(() => value) : null}
            onSubmit={() => setFocused(() => false)}
            label={i18n('form.btcAddress')}
            isValid={!isFieldInError('address')}
            onFocus={() => setFocused(() => true)}
            onBlur={() => setFocused(() => false)}
            errorMessage={getErrorsInField('address')}
          />
        </View>
        <IconButton
          icon="camera"
          title={i18n('scanQR')}
          style={tw`mr-2`}
          onPress={() => setScanQR(!scanQR)}
        />
        <IconButton
          icon="copy"
          title={i18n('paste')}
          onPress={pasteAddress}
        />
      </View>
      <Pressable style={tw`flex-row items-center px-5 mt-4`}
        onPress={() => setUseDepositAddress(!useDepositAddress)}>
        {useDepositAddress
          ? <Icon id="checkbox" style={tw`w-5 h-5`} />
          : <View style={tw`w-5 h-5 flex justify-center items-center`}>
            <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-3`} />
          </View>
        }
        <Text style={tw`mx-4`}>
          {i18n('sell.returnAddress.useDepositAddress')}
        </Text>
      </Pressable>
    </View>
    {scanQR
      ? <View style={tw`mt-20`}>
        <ScanQR onSuccess={e => {
          const request = parseBitcoinRequest(e.data)

          setAddress(request.address || e.data)
          setScanQR(false)
        }}
        onCancel={() => setScanQR(false)}
        />
      </View>
      : null}
    <View>{/* dummy for layout */}</View>
  </View>
}