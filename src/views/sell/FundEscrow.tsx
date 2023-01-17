import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { BitcoinAddress, Loading, PeachScrollView, PrimaryButton, SatsFormat, Text } from '../../components'
import { MediumSatsFormat } from '../../components/text'
import { SATSINBTC } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { offerIdToHex } from '../../utils/offer'
import { FundingSatsFormat } from './components/FundingSatsFormat'
import FundingView from './components/FundingView'
import NoEscrowFound from './components/NoEscrowFound'
import { useFundEscrowSetup } from './hooks/useFundEscrowSetup'

export default (): ReactElement => {
  const {
    sellOffer,
    updatePending,
    showRegtestButton,
    escrow,
    fundingError,
    fundingStatus,
    fundingAmount,
    fundEscrowAddress,
    cancelOffer,
  } = useFundEscrowSetup()

  const buttonText: string | JSX.Element
    = sellOffer.funding.status === 'MEMPOOL' ? (
      i18n('sell.escrow.waitingForConfirmation')
    ) : (
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-sm uppercase font-baloo text-white-1`}>{i18n('sell.escrow.fundToContinue')}</Text>
        <Loading style={tw`w-10`} color={tw`text-white-1`.color} />
      </View>
    )

  if (updatePending) return (
    <View style={tw`h-full justify-center items-center`}>
      <Loading />
      <Text style={tw`subtitle-1 text-center mt-8`}>{i18n('sell.escrow.loading')}</Text>
    </View>
  )
  if (!sellOffer.id || !escrow || !fundingStatus) return <NoEscrowFound />

  return (
    <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`px-6 pt-7 pb-10`}>
      <View style={tw``}>
        {!fundingError && (
          <View>
            <Text style={tw`text-center`}>
              <Text style={tw`settings`}>{i18n('sell.escrow.sendSats.1')} </Text>
              <FundingSatsFormat style={tw`mt-0.5 pt-px`} sats={fundingAmount} />
              <Text style={tw`settings`}> {i18n('sell.escrow.sendSats.2')}</Text>
            </Text>
            <BitcoinAddress
              style={tw`mt-4`}
              address={escrow}
              amount={sellOffer.amount / SATSINBTC}
              label={i18n('settings.escrow.paymentRequest.label', offerIdToHex(sellOffer.id!))}
            />
          </View>
        )}
      </View>
      <View style={tw`w-full flex items-center mt-4`}>
        <PrimaryButton
          testID="navigation-next"
          disabled
          narrow
          style={sellOffer.funding.status === 'MEMPOOL' ? tw`w-72` : tw`w-48`}
        >
          {buttonText}
        </PrimaryButton>
        {showRegtestButton && (
          <PrimaryButton testID="escrow-fund" style={tw`mt-1`} onPress={fundEscrowAddress} narrow>
            {'Fund escrow'}
          </PrimaryButton>
        )}
        <Pressable style={tw`mt-4`} onPress={cancelOffer}>
          <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>{i18n('cancelOffer')}</Text>
        </Pressable>
      </View>
    </PeachScrollView>
  )
}
