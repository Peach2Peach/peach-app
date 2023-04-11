/**
 * Account backups do not have to contains offers, contracts and chats.
 * This information can be requested from the server and locally decrypted
 */
export const getAccountBackup = (account: Account, settings: Settings): AccountBackup => ({
  ...account,
  settings,
  offers: [],
  contracts: [],
  chats: {},
})
