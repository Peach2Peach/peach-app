import { useCallback } from 'react'
import { useShowAppPopup } from '../../../hooks/useShowAppPopup'
import { useToggleBoolean } from '../../../hooks/useToggleBoolean'
import { UnmatchPopup } from '../../../popups/UnmatchPopup'
import tw from '../../../styles/tailwind'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { WarningPopup } from '../../../popups/WarningPopup'
import { ClosePopupAction } from '../../../popups/actions'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { error } from '../../../utils/log/error'
import { peachAPI } from '../../../utils/peachAPI'
import { Button } from '../../buttons/Button'
import { useMessageState } from '../../message/useMessageState'
import { PopupAction } from '../../popup'
import { UndoButton } from './UndoButton'

type Props = {
  match: Pick<Match, 'matched' | 'offerId'>
  offer: BuyOffer
  interruptMatching: () => void
  setShowMatchedCard: (show: boolean) => void
}

export const UnmatchButton = ({ match, offer, interruptMatching, setShowMatchedCard }: Props) => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const { mutate: unmatch } = useUnmatchOffer(offer, match.offerId)

  const [showUnmatch, toggle] = useToggleBoolean(match.matched)

  const showUnmatchPopup = useCallback(() => {
    setPopup(
      <WarningPopup
        title={i18n('search.popups.unmatch.title')}
        content={<UnmatchPopup />}
        actions={
          <>
            <PopupAction
              label={i18n('search.popups.unmatch.confirm')}
              iconId="minusCircle"
              textStyle={tw`text-black-100`}
              onPress={() => {
                setPopup(
                  <WarningPopup
                    title={i18n('search.popups.unmatched')}
                    actions={<ClosePopupAction style={tw`justify-center`} textStyle={tw`text-black-100`} />}
                  />,
                )
                unmatch(undefined, {
                  onSuccess: () => {
                    setShowMatchedCard(false)
                  },
                })
              }}
            />
            <PopupAction
              label={i18n('search.popups.unmatch.neverMind')}
              textStyle={tw`text-black-100`}
              iconId="xSquare"
              onPress={closePopup}
              reverseOrder
            />
          </>
        }
      />,
    )
  }, [closePopup, setPopup, setShowMatchedCard, unmatch])

  const showMatchUndonePopup = useShowAppPopup('matchUndone')

  const onUndoPress = () => {
    interruptMatching()
    showMatchUndonePopup()
  }

  return showUnmatch ? (
    <Button
      onPress={showUnmatchPopup}
      iconId="minusCircle"
      textColor={tw`text-error-main`}
      style={tw`bg-primary-background-light`}
    >
      {i18n('search.unmatch')}
    </Button>
  ) : (
    <UndoButton onPress={onUndoPress} onTimerFinished={toggle} />
  )
}

function useUnmatchOffer (offer: BuyOffer, matchingOfferId: string) {
  const queryClient = useQueryClient()
  const updateMessage = useMessageState((state) => state.updateMessage)

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['matches', offer.id] })
      await queryClient.cancelQueries({ queryKey: ['matchDetails', offer.id, matchingOfferId] })
      const previousData = queryClient.getQueryData<Match>(['matchDetails', offer.id, matchingOfferId])
      queryClient.setQueryData<Match>(['matchDetails', offer.id, matchingOfferId], (old) => {
        if (!old) return old
        return {
          ...old,
          matched: false,
        }
      })
      return { previousData }
    },
    mutationFn: async () => {
      const { result, error: err } = await peachAPI.private.offer.unmatchOffer({ offerId: offer.id, matchingOfferId })
      if (result) {
        return result
      }
      error('Error', err)
      updateMessage({
        msgKey: err?.error || 'error.general',
        level: 'ERROR',
      })
      throw new Error()
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(['matchDetails', offer.id, matchingOfferId], context?.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', offer.id] })
      queryClient.invalidateQueries({ queryKey: ['matchDetails', offer.id, matchingOfferId] })
    },
  })
}
