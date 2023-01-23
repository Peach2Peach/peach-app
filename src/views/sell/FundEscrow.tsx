import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { BitcoinAddress, Loading, PeachScrollView, PrimaryButton, Text } from '../../components'
import { SATSINBTC } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { offerIdToHex } from '../../utils/offer'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { FundingSatsFormat } from './components/FundingSatsFormat'
import NoEscrowFound from './components/NoEscrowFound'
import TransactionInMempool from './components/TransactionInMempool'
import { useFundEscrowSetup } from './hooks/useFundEscrowSetup'

export default (): ReactElement => {
  const { sellOffer, updatePending, showRegtestButton, escrow, fundingStatus, fundingAmount, fundEscrowAddress }
    = useFundEscrowSetup()

  if (updatePending) return (
    <View style={tw`items-center justify-center h-full`}>
      <Loading />
      <Text style={tw`mt-8 text-center subtitle-1`}>{i18n('sell.escrow.loading')}</Text>
    </View>
  )
  if (!sellOffer.id || !escrow || !fundingStatus) return <NoEscrowFound />
  if (fundingStatus.status === 'MEMPOOL') return <TransactionInMempool />

  return (
    <View style={tw`h-full`}>
      <PeachScrollView style={tw`flex-shrink h-full`} contentContainerStyle={tw`pt-4 pb-4 px-7`}>
        <View style={tw`flex-shrink h-full`}>
          <Text style={tw`text-center`}>
            <Text style={tw`settings`}>{i18n('sell.escrow.sendSats.1')} </Text>
            <FundingSatsFormat style={tw`mt-0.5 pt-px`} sats={fundingAmount} />
            <Text style={tw`settings`}> {i18n('sell.escrow.sendSats.2')}</Text>
          </Text>
          <BitcoinAddress
            style={tw`mt-4`}
            address={escrow}
            amount={sellOffer.amount / SATSINBTC}
            label={i18n('settings.escrow.paymentRequest.label') + ' ' + offerIdToHex(sellOffer.id!)}
          />
        </View>
      </PeachScrollView>
      <View style={tw`flex items-center w-full my-4`}>
        <PrimaryButton testID="navigation-next" disabled iconId="download">
          {i18n('sell.escrow.fundToContinue')}
        </PrimaryButton>
        {showRegtestButton && (
          <PrimaryButton testID="escrow-fund" style={tw`mt-1`} onPress={fundEscrowAddress} narrow>
            {'Fund escrow'}
          </PrimaryButton>
        )}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
