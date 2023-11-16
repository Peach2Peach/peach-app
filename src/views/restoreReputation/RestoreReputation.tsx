import { useState } from 'react'
import { View } from 'react-native'
import { Header, Icon, Loading, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import { userUpdate } from '../../init/userUpdate'
import tw from '../../styles/tailwind'
import { storeAccount, updateAccount } from '../../utils/account'
import { useAccountStore } from '../../utils/account/account'
import i18n from '../../utils/i18n'

export const RestoreReputation = () => {
  const route = useRoute<'restoreReputation'>()
  const navigation = useNavigation()
  const [isRestored, setIsRestored] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const account = useAccountStore((state) => state.account)

  const restoreReputation = () => {
    setIsLoading(true)
    // prevent render blocking
    setTimeout(async () => {
      updateAccount(account, true)
      await userUpdate(route.params.referralCode)

      storeAccount(account)
      setIsRestored(true)

      setTimeout(() => {
        navigation.replace('buy')
      }, 1500)
    })
  }

  return (
    <Screen
      header={
        <Header
          title={i18n('restoreBackup.restoreReputation')}
          theme="transparent"
          hideGoBackButton={isLoading || isRestored}
        />
      }
      gradientBackground
    >
      {isRestored ? (
        <ReputationRestored />
      ) : isLoading ? (
        <RestoreReputationLoading />
      ) : (
        <View style={tw`justify-between grow`}>
          <View style={tw`items-center justify-center grow`}>
            <Text style={tw`subtitle-1 text-primary-background-light`}>{i18n('restoreBackup.dontWorry')}</Text>
          </View>

          <Button
            style={tw`self-center bg-primary-background-light`}
            textColor={tw`text-primary-main`}
            onPress={restoreReputation}
          >
            {i18n('restoreBackup.restoreReputation')}
          </Button>
        </View>
      )}
    </Screen>
  )
}

function RestoreReputationLoading () {
  return (
    <View style={tw`items-center justify-center grow`}>
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
