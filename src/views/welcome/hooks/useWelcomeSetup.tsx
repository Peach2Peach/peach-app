import { RefObject, useState } from 'react'
import Carousel from 'react-native-snap-carousel'
import { useOnboardingHeader } from '../../../hooks/headers/useOnboardingHeader'
import i18n from '../../../utils/i18n'
import { AWalletYouControl } from '../AWalletYouControl'
import { LetsGetStarted } from '../LetsGetStarted'
import { PeachOfMind } from '../PeachOfMind'
import { PeerToPeer } from '../PeerToPeer'
import { PrivacyFirst } from '../PrivacyFirst'

export const screens = [PeerToPeer, PeachOfMind, PrivacyFirst, AWalletYouControl, LetsGetStarted]
type Props = {
  carousel: RefObject<Carousel<() => JSX.Element> | null>
}
export const useWelcomeSetup = ({ carousel }: Props) => {
  useOnboardingHeader({
    title: i18n('welcome.welcomeToPeach.title'),
    hideGoBackButton: true,
  })
  const [page, setPage] = useState(0)

  const next = () => {
    carousel.current?.snapToNext()
  }
  const goToEnd = () => {
    carousel.current?.snapToItem(screens.length - 1)
  }
  const progress = (page + 1) / screens.length
  const endReached = progress === 1

  return { page, setPage, progress, endReached, next, goToEnd }
}
