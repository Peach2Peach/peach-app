import { ReactElement } from 'react'
import { View } from 'react-native'
import { BitcoinAddress, Loading, PeachScrollView, PrimaryButton, Text } from '../../components'
import { SATSINBTC } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { offerIdToHex } from '../../utils/offer'
import { DailyTradingLimit } from '../settings/profile/DailyTradingLimit'
import { FundingSatsFormat } from './components/FundingSatsFormat'
import { NoEscrowFound } from './components/NoEscrowFound'
import { TransactionInMempool } from './components/TransactionInMempool'
import { useAutoFundOffer } from './hooks/regtest/useAutoFundOffer'
import { useFundEscrowSetup } from './hooks/useFundEscrowSetup'

export default (): ReactElement => {
  const { offerId, escrow, createEscrowError, fundingStatus, fundingAmount } = useFundEscrowSetup()
  const { showRegtestButton, fundEscrowAddress } = useAutoFundOffer({ offerId, fundingStatus })

  if (createEscrowError) return <NoEscrowFound />
  if (!escrow) return (
    <View style={tw`items-center justify-center h-full`}>
      <Loading />
      <Text style={tw`mt-8 text-center subtitle-1`}>{i18n('sell.escrow.loading')}</Text>
    </View>
  )
  if (fundingStatus.status === 'MEMPOOL') return <TransactionInMempool />

  return (
    <View style={tw`h-full`}>
      <PeachScrollView style={tw`flex-shrink h-full`} contentContainerStyle={tw`pt-4 pb-4 px-7`}>
        <View style={tw`flex-shrink h-full`}>
          <View style={tw`flex-row items-center justify-center`}>
            <Text style={tw`settings`}>{i18n('sell.escrow.sendSats.1')} </Text>
            <FundingSatsFormat sats={fundingAmount} />
            <Text style={tw`settings`}> {i18n('sell.escrow.sendSats.2')}</Text>
          </View>
          <BitcoinAddress
            style={tw`mt-4`}
            address={escrow}
            amount={fundingAmount / SATSINBTC}
            label={i18n('settings.escrow.paymentRequest.label') + ' ' + offerIdToHex(offerId)}
          />
        </View>
      </PeachScrollView>
      <View style={tw`flex items-center w-full my-4`}>
        <View style={tw`flex-row items-center justify-center`}>
          <Text style={tw`text-primary-main button-medium`}>{i18n('sell.escrow.checkingFundingStatus')}</Text>
          <Loading style={tw`w-5 h-5`} color={tw`text-primary-main`.color} />
        </View>
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
