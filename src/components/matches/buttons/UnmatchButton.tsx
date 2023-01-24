import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { useToggleBoolean } from '../../../hooks'
import { UnmatchPopup } from '../../../overlays/UnmatchPopup'
import tw from '../../../styles/tailwind'

import i18n from '../../../utils/i18n'
import { dropShadowStrong } from '../../../utils/layout'
import { PrimaryButton } from '../../buttons'
import { Shadow } from '../../ui'
import { useUnmatchOffer } from '../hooks'
import { UndoButton } from './UndoButton'

type Props = {
  match: Match
  offer: BuyOffer | SellOffer
  interruptMatching: () => void
  showUnmatchedCard: () => void
}

export const UnmatchButton = ({ match, offer, interruptMatching, showUnmatchedCard }: Props) => {
  const [, updateOverlay] = useContext(OverlayContext)
  const { mutate: unmatch } = useUnmatchOffer(offer, match.offerId)

  const [showUnmatch, toggle] = useToggleBoolean(match.matched)

  const showUnmatchPopup = useCallback(() => {
    updateOverlay({
      title: i18n('search.popups.unmatch.title'),
      content: <UnmatchPopup />,
      visible: true,
      action1: {
        label: i18n('search.popups.unmatch.neverMind'),
        icon: 'xSquare',
        callback: () => updateOverlay({ visible: false }),
      },
      action2: {
        label: i18n('search.popups.unmatch.confirm'),
        icon: 'minusCircle',
        callback: () => {
          updateOverlay({ visible: false })
          showUnmatchedCard()
          unmatch()
        },
      },
    })
  }, [showUnmatchedCard, unmatch, updateOverlay])

  const onUndoPress = () => {
    showUnmatchedCard()
    interruptMatching()
  }

  return (
    <Shadow shadow={dropShadowStrong}>
      {showUnmatch ? (
        <PrimaryButton onPress={showUnmatchPopup} iconId="minusCircle" textColor={tw`text-error-main`} white narrow>
          {i18n('search.unmatch')}
        </PrimaryButton>
      ) : (
        <UndoButton onPress={onUndoPress} onTimerFinished={toggle} />
      )}
    </Shadow>
  )
}
