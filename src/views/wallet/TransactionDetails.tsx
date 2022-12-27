import React, { useMemo } from 'react'
import { View } from 'react-native'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'

export default () => {
  useHeaderSetup(useMemo(() => ({ title: i18n('wallet.transactionDetails') }), []))

  return <View></View>
}
