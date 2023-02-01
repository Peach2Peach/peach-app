import { NETWORK } from '@env'
import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import { PrimaryButton } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import { useCheckTradeNotifications } from '../../../hooks/useCheckTradeNotifications'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { TradeBreakdown } from '../../../overlays/TradeBreakdown'
import tw from '../../../styles/tailwind'
import { showAddress, showTransaction } from '../../../utils/bitcoin'
import { createUserRating, getOfferIdFromContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { rateUser } from '../../../utils/peachAPI'

type RateProps = ComponentProps & {
  contract: Contract
  view: ContractViewer
  vote: 'positive' | 'negative' | undefined
  saveAndUpdate: (contract: Contract) => void
}

export const Rate = ({ contract, view, saveAndUpdate, vote, style }: RateProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const showError = useShowErrorBanner()
  const checkTradeNotifications = useCheckTradeNotifications()


  const rate = async () => {
    if (!view || !vote) return

    const rating = createUserRating(
      view === 'seller' ? contract.buyer.id : contract.seller.id,
      vote === 'positive' ? 1 : -1,
    )
    const ratedUser = view === 'seller' ? 'ratingBuyer' : 'ratingSeller'

    const [, err] = await rateUser({
      contractId: contract.id,
      rating: rating.rating,
      signature: rating.signature,
    })

    if (err) {
      showError(err.error)
      return
    }
    saveAndUpdate({
      ...contract,
      [ratedUser]: true,
    })
    checkTradeNotifications()

    if (rating.rating === 1) {
      navigation.replace('backupTime', { view, nextScreen: 'offer', offerId: getOfferIdFromContract(contract) })
    } else {
      navigation.replace('backupTime', { view, nextScreen: 'yourTrades' })
    }
  }
  const viewInExplorer = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)

  const showTradeBreakdown = () => {
    updateOverlay({
      title: i18n('tradeComplete.popup.tradeBreakdown.title'),
      content: <TradeBreakdown {...contract} />,
      visible: true,
      level: 'APP',
      action2: {
        label: i18n('tradeComplete.popup.tradeBreakdown.explorer'),
        callback: viewInExplorer,
        icon: 'externalLink',
      },
    })
  }

  return (
    <View style={style}>
      <View style={[tw`mb-4`, !vote && tw`opacity-33`]}>
        <PrimaryButton onPress={rate} white>
          {i18n('rate.rateAndFinish')}
        </PrimaryButton>
      </View>

      {view === 'buyer' && (
        <PrimaryButton onPress={showTradeBreakdown} white border>
          {i18n('rate.tradeBreakdown')}
        </PrimaryButton>
      )}
    </View>
  )
}
