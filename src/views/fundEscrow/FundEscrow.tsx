import { networks } from 'bitcoinjs-lib'
import { useMemo } from 'react'
import { View } from 'react-native'
import {
  BitcoinAddress,
  CopyAble,
  Header,
  HorizontalLine,
  Icon,
  Loading,
  PeachScrollView,
  Screen,
  Text,
} from '../../components'
import { BTCAmount } from '../../components/bitcoin'
import { Button } from '../../components/buttons/Button'
import { TradeInfo } from '../../components/offer'
import { SATSINBTC } from '../../constants'
import { useCancelOffer, useRoute, useShowHelp } from '../../hooks'
import { useMultipleOfferDetails } from '../../hooks/query/useOfferDetails'
import { useCancelFundMultipleSellOffers } from '../../hooks/useCancelFundMultipleSellOffers'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { isSellOffer, offerIdToHex } from '../../utils/offer'
import { generateBlock } from '../../utils/regtest'
import { getNetwork } from '../../utils/wallet'
import { useWalletState } from '../../utils/wallet/walletStore'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { NoEscrowFound } from './components/NoEscrowFound'
import { TransactionInMempool } from './components/TransactionInMempool'
import { useFundEscrowSetup } from './hooks/useFundEscrowSetup'
import { useFundFromPeachWallet } from './hooks/useFundFromPeachWallet'

export const FundEscrow = () => {
  const { offerId, isLoading, fundingAddress, fundingAddresses, createEscrowError, fundingStatus, fundingAmount }
    = useFundEscrowSetup()

  const { fundFromPeachWallet, fundedFromPeachWallet } = useFundFromPeachWallet({
    offerId,
    address: fundingAddress,
    addresses: fundingAddresses,
    amount: fundingAmount,
    fundingStatus,
  })

  if (createEscrowError) return <NoEscrowFound />
  if (isLoading || !fundingAddress) return <BitcoinLoading text={i18n('sell.escrow.loading')} />

  if (fundingStatus.status === 'MEMPOOL') return <TransactionInMempool offerId={offerId} txId={fundingStatus.txIds[0]} />

  return (
    <Screen header={<FundEscrowHeader />}>
      <PeachScrollView contentStyle={tw`items-center gap-4`}>
        <View style={tw`flex-row items-center justify-center gap-1`}>
          <Text style={tw`settings`}>{i18n('sell.escrow.sendSats')}</Text>
          <BTCAmount style={tw`-mt-0.5`} amount={fundingAmount} size="medium" />
          <CopyAble value={fundingAddress} textPosition="bottom" />
        </View>

        <BitcoinAddress
          address={fundingAddress}
          amount={fundingAmount / SATSINBTC}
          label={`${i18n('settings.escrow.paymentRequest.label')} ${offerIdToHex(offerId)}`}
        />
      </PeachScrollView>

      <View style={[tw`items-center justify-center gap-4 py-4`]}>
        <View style={tw`flex-row items-center justify-center gap-2`}>
          <Text style={tw`text-primary-main button-medium`}>{i18n('sell.escrow.checkingFundingStatus')}</Text>
          <Loading style={tw`w-4 h-4`} color={tw`text-primary-main`.color} />
        </View>
        <HorizontalLine />
        {fundedFromPeachWallet ? (
          <TradeInfo
            text={i18n('fundFromPeachWallet.funded')}
            IconComponent={<Icon id="checkCircle" size={16} color={tw`text-success-main`.color} />}
          />
        ) : (
          <Button ghost textColor={tw`text-primary-main`} iconId="sell" onPress={fundFromPeachWallet}>
            {i18n('fundFromPeachWallet.button')}
          </Button>
        )}
      </View>
    </Screen>
  )
}

function FundEscrowHeader () {
  const { offerId } = useRoute<'fundEscrow'>().params
  const fundMultiple = useWalletState((state) => state.getFundMultipleByOfferId(offerId))
  const { offers } = useMultipleOfferDetails(fundMultiple?.offerIds || [offerId])
  const offer = offers[0]
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined
  const showHelp = useShowHelp('escrow')
  const cancelOffer = useCancelOffer(sellOffer)
  const cancelFundMultipleOffers = useCancelFundMultipleSellOffers({ fundMultiple })

  const memoizedHeaderIcons = useMemo(() => {
    const icons = [
      { ...headerIcons.cancel, onPress: fundMultiple ? cancelFundMultipleOffers : cancelOffer },
      { ...headerIcons.help, onPress: showHelp },
    ]
    if (getNetwork() === networks.regtest) {
      icons.unshift({ ...headerIcons.generateBlock, onPress: generateBlock })
    }
    return icons
  }, [cancelFundMultipleOffers, cancelOffer, fundMultiple, showHelp])

  return <Header title={i18n('sell.escrow.title')} icons={memoizedHeaderIcons} />
}
