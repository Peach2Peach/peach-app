import React, { ReactElement } from 'react'
import { Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export const WithdrawalConfirmation = (): ReactElement => (
  <Text style={tw`text-white-1`}>{i18n('wallet.confirmWithdraw.text')}</Text>
)
