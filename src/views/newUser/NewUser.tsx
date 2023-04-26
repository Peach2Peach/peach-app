import { ReactElement } from 'react'

import CreateAccountError from './CreateAccountError'
import CreateAccountLoading from './CreateAccountLoading'
import CreateAccountSuccess from './CreateAccountSuccess'
import { useNewUserSetup } from './hooks/useNewUserSetup'
import { UserExistsForDevice } from './UserExistsForDevice'

export default (): ReactElement => {
  const { success, error, userExistsForDevice } = useNewUserSetup()
  if (success) return <CreateAccountSuccess />
  if (userExistsForDevice) return <UserExistsForDevice iDontHaveABackup={() => setShowRestoreReputationNotice(true)} />
  if (error) return <CreateAccountError err={error} />

  return <CreateAccountLoading />
}
