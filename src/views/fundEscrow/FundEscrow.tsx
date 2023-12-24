import { networks } from 'bitcoinjs-lib'
import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import { Header } from '../../components/Header'
import { Icon } from '../../components/Icon'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { Loading } from '../../components/animation/Loading'
import { BitcoinAddress } from '../../components/bitcoin/BitcoinAddress'
import { BTCAmount } from '../../components/bitcoin/btcAmount/BTCAmount'
import { Button } from '../../components/buttons/Button'
import { TradeInfo } from '../../components/offer/TradeInfo'
import { useSetPopup } from '../../components/popup/Popup'
import { PeachText } from '../../components/text/PeachText'
import { CopyAble } from '../../components/ui/CopyAble'
import { HorizontalLine } from '../../components/ui/HorizontalLine'
import { SATSINBTC } from '../../constants'
import { CancelOfferPopup } from '../../hooks/CancelOfferPopup'
import { HelpPopup } from '../../hooks/HelpPopup'
import { useCancelFundMultipleSellOffers } from '../../hooks/useCancelFundMultipleSellOffers'
import { useRoute } from '../../hooks/useRoute'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { offerIdToHex } from '../../utils/offer/offerIdToHex'
import { generateBlock } from '../../utils/regtest/generateBlock'
import { getNetwork } from '../../utils/wallet/getNetwork'
import { useWalletState } from '../../utils/wallet/walletStore'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { TransactionInMempool } from './components/TransactionInMempool'
import { useFundEscrowSetup } from './hooks/useFundEscrowSetup'
import { useFundFromPeachWallet } from './hooks/useFundFromPeachWallet'

export const FundEscrow = () => {
  const { offerId, fundingAddress, fundingAddresses, fundingStatus, fundingAmount } = useFundEscrowSetup()
  if (!fundingAddress) return <BitcoinLoading text={i18n('sell.escrow.loading')} />

  if (fundingStatus.status === 'MEMPOOL') return <TransactionInMempool offerId={offerId} txId={fundingStatus.txIds[0]} />

  return (
    <Screen header={<FundEscrowHeader />}>
      <PeachScrollView contentStyle={tw`items-center gap-4`}>
        <View style={tw`flex-row items-center justify-center gap-1`}>
          <PeachText style={tw`settings`}>{i18n('sell.escrow.sendSats')}</PeachText>
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
          <PeachText style={tw`text-primary-main button-medium`}>{i18n('sell.escrow.checkingFundingStatus')}</PeachText>
          <Loading style={tw`w-4 h-4`} color={tw.color('primary-main')} />
        </View>
        <HorizontalLine />
        <FundFromPeachWalletButton
          address={fundingAddress}
          addresses={fundingAddresses}
          amount={fundingAmount}
          fundingStatus={fundingStatus}
        />
      </View>
    </Screen>
  )
}

function FundEscrowHeader () {
  const { offerId } = useRoute<'fundEscrow'>().params
  const fundMultiple = useWalletState((state) => state.getFundMultipleByOfferId(offerId))
  const setPopup = useSetPopup()
  const showHelp = useCallback(() => setPopup(<HelpPopup id="fundEscrow" />), [setPopup])
  const cancelOffer = useCallback(() => setPopup(<CancelOfferPopup offerId={offerId} />), [offerId, setPopup])

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

type Props = {
  address: string
  addresses: string[]
  amount: number
  fundingStatus: FundingStatus
}

function FundFromPeachWalletButton (props: Props) {
  const { offerId } = useRoute<'fundEscrow'>().params
  const fundFromPeachWallet = useFundFromPeachWallet()
  const fundedFromPeachWallet = useWalletState((state) => state.isFundedFromPeachWallet(props.address))
  const [isFunding, setIsFunding] = useState(false)

  const onButtonPress = () => {
    setIsFunding(true)
    fundFromPeachWallet({
      offerId,
      amount: props.amount,
      fundingStatus: props.fundingStatus.status,
      address: props.address,
      addresses: props.addresses,
    }).then(() => setIsFunding(false))
  }

  return (
    <>
      {fundedFromPeachWallet ? (
        <TradeInfo
          text={i18n('fundFromPeachWallet.funded')}
          IconComponent={<Icon id="checkCircle" size={16} color={tw.color('success-main')} />}
        />
      ) : (
        <Button ghost textColor={tw`text-primary-main`} iconId="sell" onPress={onButtonPress} loading={isFunding}>
          {i18n('fundFromPeachWallet.button')}
        </Button>
      )}
    </>
  )
}
