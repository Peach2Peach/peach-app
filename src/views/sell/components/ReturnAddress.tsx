import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../../styles/tailwind'

import LanguageContext from '../../../contexts/language'
import i18n from '../../../utils/i18n'
import { Headline, IconButton, Input, ScanQR, Text } from '../../../components'
import { getMessages, rules } from '../../../utils/validation'
import Clipboard from '@react-native-clipboard/clipboard'
import Icon from '../../../components/Icon'
import { cutOffAddress } from '../../../utils/string'
import { parseBitcoinRequest } from '../../../utils/bitcoin'
import { patchOffer } from '../../../utils/peachAPI'
import { error } from '../../../utils/log'
import { MessageContext } from '../../../contexts/message'

const { useValidation } = require('react-native-form-validator')


export type ReturnAddressProps = ComponentProps & {
  offer: SellOffer,
  updateOffer: (offer: SellOffer) => void,
  setStepValid: (isValid: boolean) => void,
}

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid, style }: ReturnAddressProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

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

    ;(async () => {
      if (!offer.id) return

      const [result, err] = await patchOffer({
        offerId: offer.id,
        returnAddress: address
      })
      if (!result?.success || err) {
        error('Error', err)
        if (err) updateMessage({ msg: i18n(err.error || 'error.general'), level: 'ERROR' })
      }
    })()
  }, [address, useDepositAddress])

  useEffect(() => {
    if (useDepositAddress) {
      $address.blur()
      setFocused(!useDepositAddress)
      setStepValid(true)
    }
  }, [useDepositAddress])

  return <View style={style}>
    <Headline style={tw`text-grey-1`}>
      {i18n('sell.escrow.returnAddress.title')}
    </Headline>
    <Text style={tw`text-grey-2 text-center -mt-2`}>
      {i18n('sell.escrow.returnAddress.subtitle')}
    </Text>
    <View pointerEvents={useDepositAddress ? 'none' : 'auto'}
      style={[
        tw`flex-row mt-4`,
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
  </View>
}