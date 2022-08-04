import React, { ReactElement, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../../styles/tailwind'

import i18n from '../../../utils/i18n'
import { Headline, IconButton, Input, ScanQR, Text } from '../../../components'
import { getMessages, rules } from '../../../utils/validation'
import Clipboard from '@react-native-clipboard/clipboard'
import Icon from '../../../components/Icon'
import { cutOffAddress } from '../../../utils/string'
import { parseBitcoinRequest } from '../../../utils/bitcoin'
import { BarCodeReadEvent } from 'react-native-camera'

const { useValidation } = require('react-native-form-validator')

export type ReturnAddressProps = ComponentProps & {
  returnAddress?: string,
  update: (address: string) => void,
}

// eslint-disable-next-line max-lines-per-function
export default ({ returnAddress, update, style }: ReturnAddressProps): ReactElement => {
  let $address: any
  const [address, setAddress] = useState(returnAddress)
  const [shortAddress, setShortAddress] = useState(returnAddress ? cutOffAddress(returnAddress) : '')
  const [focused, setFocused] = useState(false)
  const [useDepositAddress, setUseDepositAddress] = useState(!returnAddress)
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
    if (!useDepositAddress) {
      if (!address) return

      setShortAddress(cutOffAddress(address || ''))

      validate({
        address: {
          required: true,
          bitcoinAddress: true
        }
      })

      if (!isFormValid()) return
      update(address)
    } else {
      update('')
    }
  }, [address, useDepositAddress])

  useEffect(() => {
    if (useDepositAddress) {
      $address.blur()
      setFocused(!useDepositAddress)
    }
  }, [useDepositAddress])

  const showQRScanner = () => setScanQR(true)
  const closeQRScanner = () => setScanQR(false)
  const onQRScanSuccess = (e: BarCodeReadEvent) => {
    const request = parseBitcoinRequest(e.data)

    setAddress(request.address || e.data)
    setScanQR(false)
  }
  const toggleUseDepositAddress = () => setUseDepositAddress(!useDepositAddress)
  return <View style={style}>
    <Headline style={tw`text-grey-1`}>
      {i18n('sell.escrow.returnAddress.title')}
    </Headline>
    <Text style={tw`text-grey-2 text-center -mt-2`}>
      {i18n('sell.escrow.returnAddress.subtitle')}
    </Text>
    <View pointerEvents={useDepositAddress ? 'none' : 'auto'}
      style={[
        tw`flex flex-row mt-4`,
        useDepositAddress ? tw`opacity-50` : {}
      ]}>
      <View style={tw`w-full flex-shrink mr-2`}>
        <Input reference={(el: any) => $address = el}
          value={focused ? address : shortAddress}
          style={tw`pl-4 pr-8`}
          onChange={(value: string) => focused ? setAddress(() => value) : null}
          onSubmit={() => setFocused(() => false)}
          label={i18n('form.address.btc')}
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
        onPress={showQRScanner}
      />
      <IconButton
        icon="copy"
        title={i18n('paste')}
        onPress={pasteAddress}
      />
    </View>
    <Pressable style={tw`flex-row items-center px-5 mt-4`}
      onPress={toggleUseDepositAddress}>
      {useDepositAddress
        ? <Icon id="checkbox" style={tw`w-5 h-5`} color={tw`text-peach-1`.color as string}/>
        : <View style={tw`w-5 h-5 flex justify-center items-center`}>
          <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-3`} />
        </View>
      }
      <Text style={tw`mx-4`}>
        {i18n('sell.returnAddress.useDepositAddress')}
      </Text>
    </Pressable>
    {scanQR
      ? <View style={tw`mt-20`}>
        <ScanQR onSuccess={onQRScanSuccess} onCancel={closeQRScanner}/>
      </View>
      : null}
  </View>
}