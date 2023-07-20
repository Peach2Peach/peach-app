import 'react-native-url-polyfill/auto'
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links'
import { useNavigation } from './useNavigation'
import { useCallback, useEffect } from 'react'
import { account } from '../utils/account'

export const useDynamicLinks = () => {
  const navigation = useNavigation()

  const handleReferralCode = useCallback(
    (link?: FirebaseDynamicLinksTypes.DynamicLink | null) => {
      if (!link) return
      const url = link.url

      if (!url.includes('/referral')) return

      const referralCode = new URL(url).searchParams.get('code')
      if (referralCode && !account.publicKey) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'welcome', params: { referralCode } }],
        })
      }
    },
    [navigation],
  )

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleReferralCode)
    dynamicLinks().getInitialLink().then(handleReferralCode)
    return () => unsubscribe()
  }, [handleReferralCode])

  return handleReferralCode
}
