import { RefObject, useState } from 'react'
import { ICarouselInstance } from 'react-native-reanimated-carousel'
import { useOnboardingHeader } from '../../../hooks/headers/useOnboardingHeader'
import i18n from '../../../utils/i18n'
import { AWalletYouControl } from '../AWalletYouControl'
import { LetsGetStarted } from '../LetsGetStarted'
import { PeachOfMind } from '../PeachOfMind'
import { PeerToPeer } from '../PeerToPeer'
import { PrivacyFirst } from '../PrivacyFirst'

export const screens = [PeerToPeer, PeachOfMind, PrivacyFirst, AWalletYouControl, LetsGetStarted]
type Props = {
  carousel: RefObject<ICarouselInstance>
}
export const useWelcomeSetup = ({ carousel }: Props) => {
  useOnboardingHeader({
    title: i18n('welcome.welcomeToPeach.title'),
    hideGoBackButton: true,
  })
  const [page, setPage] = useState(0)

  const next = () => {
    carousel.current?.next()
    setPage((p) => p + 1)
  }
  const goToEnd = () => {
    carousel.current?.next({ count: screens.length - 1 - page })
    setPage(screens.length - 1)
  }
  const progress = (page + 1) / screens.length
  const endReached = progress === 1

  return { page, setPage, progress, endReached, next, goToEnd }
}
