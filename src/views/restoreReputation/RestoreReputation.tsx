import { useState } from 'react'
import { View } from 'react-native'
import { Icon, Loading, PrimaryButton, Text } from '../../components'
import { useNavigation, useRoute } from '../../hooks'
import { useOnboardingHeader } from '../../hooks/headers/useOnboardingHeader'
import { useTemporaryAccount } from '../../hooks/useTemporaryAccount'
import { userUpdate } from '../../init/userUpdate'
import tw from '../../styles/tailwind'
import { storeAccount, updateAccount } from '../../utils/account'
import i18n from '../../utils/i18n'

export const RestoreReputation = () => {
  const route = useRoute<'restoreReputation'>()
  const navigation = useNavigation()
  const [isRestored, setIsRestored] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { temporaryAccount } = useTemporaryAccount()

  useOnboardingHeader({
    title: i18n('restoreBackup.restoreReputation'),
    icons: isLoading ? [] : undefined,
    hideGoBackButton: isLoading,
  })

  const restoreReputation = () => {
    if (!temporaryAccount) return
    setIsLoading(true)
    // prevent render blocking
    setTimeout(async () => {
      updateAccount(temporaryAccount, true)
      await userUpdate(route.params.referralCode)

      storeAccount(temporaryAccount)
      setIsRestored(true)

      setTimeout(() => {
        navigation.replace('buy')
      }, 1500)
    })
  }

  if (isRestored) return <ReputationRestored />
  if (isLoading) return <RestoreReputationLoading />

  return (
    <View style={tw`justify-between h-full px-8`}>
      <View style={tw`items-center justify-center h-full shrink`}>
        <Text style={tw`subtitle-1 text-primary-background-light`}>{i18n('restoreBackup.dontWorry')}</Text>
      </View>
      <View style={tw`items-center w-full`}>
        <PrimaryButton onPress={restoreReputation} white iconId="save">
          {i18n('restoreBackup.restoreReputation')}
        </PrimaryButton>
      </View>
    </View>
  )
}

function RestoreReputationLoading () {
  return (
    <View style={tw`items-center justify-center h-full`}>
      <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('restoreBackup.restoringReputation')}</Text>
      <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('newUser.oneSec')}</Text>
      <Loading style={tw`w-32 h-32`} color={tw`text-primary-mild-1`.color} />
    </View>
  )
}

function ReputationRestored () {
  return (
    <View style={tw`items-center justify-center h-full`}>
      <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('restoreBackup.reputationRestored')}</Text>
      <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('restoreBackup.welcomeBack')}</Text>
      <Icon id="save" style={tw`w-32 h-32 mt-16`} color={tw`text-primary-background-light`.color} />
    </View>
  )
}
