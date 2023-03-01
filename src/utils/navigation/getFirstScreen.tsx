import { account } from '../account'
export const getFirstScreen = (hasSeenRedesignWelcome: boolean) =>
  hasSeenRedesignWelcome ? (!!account?.publicKey ? 'home' : 'welcome') : 'redesignWelcome'
