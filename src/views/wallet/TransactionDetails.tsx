import React from 'react'
import { Text } from '../../components'
import { useTransactionDetailsSetup } from './hooks/useTransactionDetailsSetup'

export default () => {
  const { route } = useTransactionDetailsSetup()

  return <Text>{route.params.txId}</Text>
}
