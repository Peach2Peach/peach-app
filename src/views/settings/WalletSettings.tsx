import React, { ReactElement, useCallback, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, PeachScrollView, PrimaryButton, Text } from '../../components'
import { Input } from '../../components/inputs'
import { useValidatedState } from '../../hooks'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { useWalletSettingsSetup } from './hooks/useWalletSettingsSetup'
import { peachWallet } from '../../utils/wallet/setWallet'

const rulesToCheck = { url: true, required: true }
export default (): ReactElement => {
  const { nodeURL, setNodeURL } = useWalletSettingsSetup()
  const [url, setURL, isValid, urlErrors] = useValidatedState(nodeURL, rulesToCheck)
  const [isUpdated, setUpdated] = useState(!!account.settings.nodeURL)

  const onChange = useCallback(
    (value: string) => {
      setURL((prev) => {
        if (prev !== value) {
          setUpdated(false)
        }
        return value
      })
    },
    [setURL],
  )

  const confirmNewURL = () => {
    if (!isValid) return
    setNodeURL(url)
    peachWallet.loadWallet(account.mnemonic)

    setUpdated(true)
  }

  return (
    <View style={tw`flex items-center w-full h-full px-8`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-shrink h-full`}>
        <View>
          <Input
            {...{
              placeholder: i18n('settings.walletSettings.node'),
              onChange,
              value: url,
              errorMessage: urlErrors,
            }}
          />
        </View>
        {isUpdated && (
          <View style={tw`flex-row justify-center w-full h-0`}>
            <Text style={tw`h-6 uppercase button-medium`}>{i18n('settings.walletSettings.success')}</Text>
            <Icon id="check" style={tw`w-5 h-5 ml-1`} color={tw`text-success-main`.color} />
          </View>
        )}
      </PeachScrollView>
      <PrimaryButton narrow style={tw`absolute mt-16 bottom-6`} onPress={confirmNewURL} disabled={!isValid || isUpdated}>
        {i18n('confirm')}
      </PrimaryButton>
    </View>
  )
}
