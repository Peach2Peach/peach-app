import { CLIENTSERVERTIMEDIFFERENCE } from '../../constants'

export const getAuthenticationChallenge = () => `Peach Registration ${String(Date.now() - CLIENTSERVERTIMEDIFFERENCE)}`
