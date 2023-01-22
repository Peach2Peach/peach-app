import React, { useCallback, useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { useToggleBoolean } from '../../../hooks'

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
  const timer = useRef(new Animated.Value(5)).current

  const startTimer = useCallback(() => {
    Animated.timing(timer, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return
      toggle()
    })
  }, [timer, toggle])

  useEffect(() => {
    if (!showUnmatch) startTimer()
  }, [showUnmatch, startTimer])

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
        <PrimaryButton onPress={onUnmatchPress} iconId="minusCircle" white narrow>
          {i18n('search.unmatch')}
        </PrimaryButton>
      ) : (
        <UndoButton onPress={onUndoPress} timer={timer} inputRange={[0, 5]} />
      )}
    </Shadow>
  )
}
