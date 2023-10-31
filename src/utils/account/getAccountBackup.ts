type Props = {
  account: Account
  paymentData: PaymentData[]
  settings: Settings
}

/**
 * Account backups do not have to contains offers, contracts and chats.
 * This information can be requested from the server and locally decrypted
 */
export const getAccountBackup = ({ account, settings, paymentData }: Props): AccountBackup => ({
  ...account,
  paymentData,
  settings,
  offers: [],
  chats: {},
})
