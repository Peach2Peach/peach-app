import { useCallback } from 'react'
import { useToggleBoolean } from '../../../hooks'
import { useShowAppPopup } from '../../../hooks/useShowAppPopup'
import { UnmatchPopup } from '../../../popups/UnmatchPopup'
import tw from '../../../styles/tailwind'

import { shallow } from 'zustand/shallow'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { Button } from '../../buttons/Button'
import { useUnmatchOffer } from '../hooks'
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
    setPopup({
      title: i18n('search.popups.unmatch.title'),
      content: <UnmatchPopup />,
      visible: true,
      level: 'WARN',
      action1: {
        label: i18n('search.popups.unmatch.neverMind'),
        icon: 'xSquare',
        callback: closePopup,
      },
      action2: {
        label: i18n('search.popups.unmatch.confirm'),
        icon: 'minusCircle',
        callback: () => {
          setPopup({ title: i18n('search.popups.unmatched'), level: 'WARN', visible: true })
          showUnmatchedCard()
          unmatch()
        },
      },
    })
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
