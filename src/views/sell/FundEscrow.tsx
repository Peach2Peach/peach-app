import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { BitcoinAddress, Loading, PeachScrollView, PrimaryButton, SatsFormat, Text } from '../../components'
import { MediumSatsFormat } from '../../components/text'
import { SATSINBTC } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { offerIdToHex } from '../../utils/offer'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { FundingSatsFormat } from './components/FundingSatsFormat'
import FundingView from './components/FundingView'
import NoEscrowFound from './components/NoEscrowFound'
import { useFundEscrowSetup } from './hooks/useFundEscrowSetup'

export default (): ReactElement => {
  const { sellOffer, updatePending, showRegtestButton, escrow, fundingStatus, fundingAmount, fundEscrowAddress }
    = useFundEscrowSetup()

  if (updatePending) return (
    <View style={tw`h-full justify-center items-center`}>
      <Loading />
      <Text style={tw`subtitle-1 text-center mt-8`}>{i18n('sell.escrow.loading')}</Text>
    </View>
  )
  if (!sellOffer.id || !escrow || !fundingStatus) return <NoEscrowFound />

  return (
    <View style={tw`h-full`}>
      <PeachScrollView style={tw`h-full flex-shrink`} contentContainerStyle={tw`px-7 pt-4 pb-4`}>
        <View style={tw`h-full flex-shrink`}>
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
      <View style={tw`w-full flex items-center mb-4`}>
        <PrimaryButton testID="navigation-next" disabled iconId="download">
          {sellOffer.funding.status === 'MEMPOOL'
            ? i18n('sell.escrow.waitingForConfirmation')
            : i18n('sell.escrow.fundToContinue')}
        </PrimaryButton>
        {false && showRegtestButton && (
          <PrimaryButton testID="escrow-fund" style={tw`mt-1`} onPress={fundEscrowAddress} narrow>
            {'Fund escrow'}
          </PrimaryButton>
        )}
      </View>
      <DailyTradingLimit />
    </View>
  )
}
