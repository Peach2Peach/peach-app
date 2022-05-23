import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { BuyViewProps } from './Buy'
import { Fade, Headline, IconButton, Input, ScanQR, TextLink, Title } from '../../components'
import { getMessages, rules } from '../../utils/validation'
import Clipboard from '@react-native-clipboard/clipboard'
import { cutOffAddress } from '../../utils/string'
import { OverlayContext } from '../../contexts/overlay'
import IDontHaveAWallet from './components/IDontHaveAWallet'
import { parseBitcoinRequest } from '../../utils/bitcoin'
import { BarCodeReadEvent } from 'react-native-camera'

const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  useContext(LanguageContext)

  const [address, setAddress] = useState(offer.releaseAddress)
  const [shortAddress, setShortAddress] = useState(offer.releaseAddress ? cutOffAddress(offer.releaseAddress) : '')
  const [focused, setFocused] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
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
    if (!address && !offer.releaseAddress) {
      setStepValid(false)
      return
    }

    setShortAddress(cutOffAddress(address || offer.releaseAddress || ''))

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
      releaseAddress: address,
    })
  }, [address])

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))
  }, [])

  const showQRScanner = () => setScanQR(true)
  const closeQRScanner = () => setScanQR(false)
  const onQRScanSuccess = (e: BarCodeReadEvent) => {
    const request = parseBitcoinRequest(e.data)

    setAddress(request.address || e.data)
    setScanQR(false)
  }
  const showIDontHaveAWallet = () => updateOverlay({
    content: <IDontHaveAWallet />, showCloseButton: true
  })
  return <View style={tw`h-full flex-col justify-between px-6`}>
    <Title title={i18n('buy.title')} />
    <View>
      <Headline style={tw`text-grey-1`}>
        {i18n('buy.releaseAddress')}
      </Headline>
      <View style={tw`flex-row mt-3`}>
        <View style={tw`w-full flex-shrink mr-2`}>
          <Input value={focused ? address : shortAddress}
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
    </View>
    {scanQR
      ? <View style={tw`mt-20`}>
        <ScanQR onSuccess={onQRScanSuccess} onCancel={closeQRScanner}/>
      </View>
      : null}

    <Fade show={!keyboardOpen} displayNone={false}>
      <TextLink style={tw`mt-4 text-center`} onPress={showIDontHaveAWallet}>
        {i18n('iDontHaveAWallet')}
      </TextLink>
    </Fade>
  </View>
}