import { CreateAccountError } from './CreateAccountError'
import { CreateAccountLoading } from './CreateAccountLoading'
import { CreateAccountSuccess } from './CreateAccountSuccess'
import { UserExistsForDevice } from './UserExistsForDevice'
import { useNewUserSetup } from './hooks/useNewUserSetup'

export default () => {
  const { success, error, userExistsForDevice } = useNewUserSetup()
  if (success) return <CreateAccountSuccess />
  if (userExistsForDevice) return <UserExistsForDevice />
  if (error) return <CreateAccountError err={error} />

  return <CreateAccountLoading />
}
