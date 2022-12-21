import React, { ReactElement, useState } from 'react'
import BackupPasswordPrompt from './BackupPasswordPrompt'
import { FileBackupOverview } from './FileBackupOverview'

export default (): ReactElement => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const togglePasswordPrompt = () => setShowPasswordPrompt(true)

  return showPasswordPrompt ? <BackupPasswordPrompt /> : <FileBackupOverview next={togglePasswordPrompt} />
}
