import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { Header, Icon, Loading, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import { useOnboardingHeader } from '../../hooks/headers/useOnboardingHeader'
import { useTemporaryAccount } from '../../hooks/useTemporaryAccount'
import { userUpdate } from '../../init/userUpdate'
import tw from '../../styles/tailwind'
import { deleteAccount, signMessageWithAccount, storeAccount, updateAccount } from '../../utils/account'
import i18n from '../../utils/i18n'
import { register } from '../../utils/peachAPI'
import { getAuthenticationChallenge } from '../../utils/peachAPI/getAuthenticationChallenge'
import { MenuItem } from './components/MenuItem'

export const NewUser = () => {
  const route = useRoute<'newUser'>()
  const navigation = useNavigation()

  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const { setTemporaryAccount } = useTemporaryAccount()
  const [userExistsForDevice, setUserExistsForDevice] = useState(false)
  const [error, setError] = useState('')

  useOnboardingHeader({
    title: i18n('welcome.welcomeToPeach.title'),
    hideGoBackButton: !success || userExistsForDevice || !!error,
    icons: isLoading ? [] : undefined,
  })

  const onError = useCallback((err?: string) => {
    const errorMsg = err || 'UNKNOWN_ERROR'
    setError(errorMsg)
    deleteAccount()
  }, [])

  const onSuccess = useCallback(
    async (account: Account & { mnemonic: string; base58: string }) => {
      const message = getAuthenticationChallenge()

      const [result, authError] = await register({
        publicKey: account.publicKey,
        message,
        signature: signMessageWithAccount(message, account),
      })

      if (!result || authError) {
        onError(authError?.error)
        return
      }

      if (result.restored) {
        setTemporaryAccount(account)
        setUserExistsForDevice(true)
        return
      }
      updateAccount(account, true)
      await userUpdate(route.params.referralCode)

      storeAccount(account)
      setSuccess(true)

      setTimeout(() => {
        navigation.replace('buy')
      }, 1500)
    },
    [navigation, onError, route.params.referralCode, setTemporaryAccount],
  )

  // useEffect(() => {
  //   // creating an account is CPU intensive and causing iOS to show a black bg upon hiding keyboard
  //   setTimeout(async () => {
  //     try {
  //       await onSuccess(await createAccount())
  //     } catch (e) {
  //       onError(parseError(e))
  //     }
  //     setIsLoading(false)
  //   })
  // }, [onError, onSuccess])

  return (
    <Screen
      header={<Header title={i18n('welcome.welcomeToPeach.title')} theme="transparent" hideGoBackButton />}
      gradientBackground
    >
      {success ? (
        <CreateAccountSuccess />
      ) : userExistsForDevice ? (
        <UserExistsForDevice />
      ) : error ? (
        <CreateAccountError err={error} />
      ) : (
        <CreateAccountLoading />
      )}
    </Screen>
  )
}

function CreateAccountLoading () {
  return (
    <View style={tw`items-center justify-center gap-4 grow`}>
      <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('newUser.title.create')}</Text>
      <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('newUser.oneSec')}</Text>
      <Loading style={tw`w-32 h-32`} color={tw`text-primary-mild-1`.color} />
    </View>
  )
}

type Props = {
  err: string
}
function CreateAccountError ({ err }: Props) {
  const navigation = useNavigation()
  const goToContact = () => navigation.navigate('contact')
  const goToRestoreBackup = () => navigation.navigate('restoreBackup')

  return (
    <View style={tw`items-center justify-between grow`}>
      <View style={tw`items-center justify-center gap-16 grow`}>
        <View>
          <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('newUser.title.create')}</Text>
          <Text style={tw`text-center body-l text-primary-background-light`}>{i18n(`${err}.text`)}</Text>
        </View>
        <Icon id="userX" size={128} color={tw`text-primary-background-light`.color} />
      </View>

      <View style={tw`gap-2`}>
        <Button onPress={goToContact} style={tw`bg-primary-background-light`} textColor={tw`text-primary-main`}>
          {i18n('contactUs')}
        </Button>
        <Button onPress={goToRestoreBackup} ghost>
          {i18n('restore')}
        </Button>
      </View>
    </View>
  )
}

function CreateAccountSuccess () {
  return (
    <View style={tw`items-center justify-center gap-16 grow`}>
      <View>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('newUser.title.accountCreated')}</Text>
        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('newUser.welcome')}</Text>
      </View>
      <Icon id="userCheck" size={128} color={tw`text-primary-background-light`.color} />
    </View>
  )
}

function UserExistsForDevice () {
  const route = useRoute<'newUser'>()
  const navigation = useNavigation()
  const goToRestoreFromFile = () => navigation.navigate('restoreBackup', { tab: 'fileBackup' })
  const goToRestoreFromSeed = () => navigation.navigate('restoreBackup', { tab: 'seedPhrase' })
  const goToRestoreReputation = () => navigation.navigate('restoreReputation', route.params)

  return (
    <View style={tw`items-center justify-center gap-8`}>
      <View>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('newUser.accountNotCreated')}</Text>
        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('newUser.youAlreadyHaveOne')}</Text>
      </View>
      <Icon id="userX" size={128} color={tw`text-primary-background-light`.color} />
      <View style={tw`items-center gap-8`}>
        <MenuItem onPress={goToRestoreFromFile}>{i18n('restoreBackup.restoreFromFile')}</MenuItem>
        <MenuItem onPress={goToRestoreFromSeed}>{i18n('restoreBackup.restoreFromSeed')}</MenuItem>
        <MenuItem onPress={goToRestoreReputation}>{i18n('restoreBackup.IdontHave')}</MenuItem>
      </View>
    </View>
  )
}
