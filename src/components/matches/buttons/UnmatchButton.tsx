import React from 'react'
import { useToggleBoolean } from '../../../hooks'
import tw from '../../../styles/tailwind'

import i18n from '../../../utils/i18n'
import { dropShadowStrong } from '../../../utils/layout'
import { PrimaryButton } from '../../buttons'
import { Shadow } from '../../ui'
import { useUnmatchOffer } from '../hooks'
import { useMatchStore } from '../store'
import { UndoButton } from './UndoButton'

type Props = {
  match: Match
  interruptMatching: () => void
  showUnmatchedCard: () => void
}

export const UnmatchButton = ({ match, interruptMatching, showUnmatchedCard }: Props) => {
  const offer = useMatchStore((state) => state.offer)
  const { mutate: unmatch } = useUnmatchOffer(offer, match.offerId)

  const [showUnmatch, toggle] = useToggleBoolean(match.matched)

  const onUnmatchPress = () => {
    showUnmatchedCard()
    unmatch()
  }

  const onUndoPress = () => {
    showUnmatchedCard()
    interruptMatching()
  }

  return (
    <Shadow shadow={dropShadowStrong}>
      {showUnmatch ? (
        <PrimaryButton onPress={onUnmatchPress} iconId="minusCircle" textColor={tw`text-error-main`} white narrow>
          {i18n('search.unmatch')}
        </PrimaryButton>
      ) : (
        <UndoButton onPress={onUndoPress} onTimerFinished={toggle} />
      )}
    </Shadow>
  )
}
