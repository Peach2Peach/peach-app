import { useCallback } from 'react'
import { useToggleBoolean } from '../../../hooks'
import { useShowAppPopup } from '../../../hooks/useShowAppPopup'
import { UnmatchPopup } from '../../../popups/UnmatchPopup'
import tw from '../../../styles/tailwind'

import { shallow } from 'zustand/shallow'
import { WarningPopup } from '../../../popups/WarningPopup'
import { ClosePopupAction } from '../../../popups/actions'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { Button } from '../../buttons/Button'
import { PopupAction } from '../../popup'
import { useUnmatchOffer } from '../hooks/useUnmatchOffer'
import { UndoButton } from './UndoButton'

type Props = {
  match: Pick<Match, 'matched' | 'offerId'>
  offer: BuyOffer | SellOffer
  interruptMatching: () => void
  showUnmatchedCard: () => void
}

export const UnmatchButton = ({ match, offer, interruptMatching, showUnmatchedCard }: Props) => {
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
              textStyle={tw`text-black-1`}
              onPress={() => {
                setPopup(
                  <WarningPopup
                    title={i18n('search.popups.unmatched')}
                    actions={<ClosePopupAction style={tw`justify-center`} textStyle={tw`text-black-1`} />}
                  />,
                )
                showUnmatchedCard()
                unmatch()
              }}
            />
            <PopupAction
              label={i18n('search.popups.unmatch.neverMind')}
              textStyle={tw`text-black-1`}
              iconId="xSquare"
              onPress={closePopup}
              reverseOrder
            />
          </>
        }
      />,
    )
  }, [closePopup, setPopup, showUnmatchedCard, unmatch])

  const showMatchUndonePopup = useShowAppPopup('matchUndone')

  const onUndoPress = () => {
    showUnmatchedCard()
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
