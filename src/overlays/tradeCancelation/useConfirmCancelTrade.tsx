import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react'
import { getContract } from '../../utils/contract'
import { Text } from '../../components'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { checkRefundPSBT, signPSBT } from '../../utils/bitcoin'
import { getSellOfferFromContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { getOfferExpiry, saveOffer } from '../../utils/offer'
import { cancelContract, patchOffer } from '../../utils/peachAPI'
import { account } from '../../utils/account'
import { ContractCanceled } from './ContractCanceled'

/**
 * @description Overlay the seller sees when requesting cancelation
 */
export const useConfirmCancelTrade = (contractId: string) => {
  const contract = getContract(contractId)!
  const [, updateOverlay] = useContext(OverlayContext)
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const [loading, setLoading] = useState(false)
  const sellOffer = useMemo(() => getSellOfferFromContract(contract), [contract])
  const expiry = useMemo(() => getOfferExpiry(sellOffer), [sellOffer])
  const closeOverlay = () => updateOverlay({ visible: false })
  const cancelBuyer = async () => {
    setLoading(true)
    const [result, err] = await cancelContract({
      contractId,
    })

    if (result) {
      saveContract({
        ...contract,
        canceled: true,
      })
      updateOverlay({ content: <ContractCanceled contract={contract} />, visible: true })
    } else if (err) {
      error('Error', err)
    }
    setLoading(false)
  }
  const cancelSeller = async () => {
    setLoading(true)
    const [result, err] = await cancelContract({
      contractId: contract.id,
      // satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
    })

    if (result?.psbt) {
      const { isValid, psbt, err: checkRefundPSBTError } = checkRefundPSBT(result.psbt, sellOffer)
      if (isValid && psbt) {
        const signedPSBT = signPSBT(psbt, sellOffer, false)
        const [patchOfferResult, patchOfferError] = await patchOffer({
          offerId: sellOffer.id!,
          refundTx: signedPSBT.toBase64(),
        })
        if (patchOfferResult) {
          closeOverlay()
          navigation.navigate('yourTrades')
          saveOffer({
            ...sellOffer,
            refundTx: psbt.toBase64(),
          })
          saveContract({
            ...contract,
            cancelConfirmationDismissed: false,
            cancelationRequested: true,
            cancelConfirmationPending: true,
          })
        } else if (patchOfferError) {
          error('Error', patchOfferError)
          updateMessage({
            msgKey: patchOfferError?.error || 'GENERAL_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          })
        }
      } else if (checkRefundPSBTError) {
        error('Error', checkRefundPSBTError)
        updateMessage({
          msgKey: checkRefundPSBTError || 'GENERAL_ERROR',
          level: 'ERROR',
          action: {
            callback: () => navigation.navigate('contact'),
            label: i18n('contactUs'),
            icon: 'mail',
          },
        })
      }
    } else if (err) {
      error('Error', err)
      updateMessage({
        msgKey: err?.error || 'GENERAL_ERROR',
        level: 'ERROR',
        action: {
          callback: () => navigation.navigate('contact'),
          label: i18n('contactUs'),
          icon: 'mail',
        },
      })
    }
    setLoading(false)
  }

  const showOverlay = useCallback(() => {
    updateOverlay({
      title: i18n('contract.cancel.title'),
      level: 'ERROR',
      content: <ConfirmCancelTrade contract={contract} />,
      visible: true,
      action1: {
        label: i18n('contract.cancel.title'),
        icon: 'xCircle',
        callback: account.publicKey === contract.seller.id ? cancelSeller : cancelBuyer,
      },
      action2: {
        label: i18n('contract.cancel.confirm.back'),
        icon: 'arrowLeftCircle',
        callback: closeOverlay,
      },
    })
  }, [updateOverlay, contract, navigation])
  return showOverlay
}

declare type ConfirmCancelTradeProps = {
  contract: Contract
}

const ConfirmCancelTrade = ({ contract }: ConfirmCancelTradeProps): ReactElement => (
  <>
    <Text style={tw`mb-3 body-m`}>{i18n('contract.cancel.text')}</Text>
    <Text style={tw`body-m`}>
      {i18n(`contract.cancel.${account.publicKey === contract.seller.id ? 'seller' : 'buyer'}`)}
    </Text>
  </>
)
