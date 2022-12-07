import { CLIENTSERVERTIMEDIFFERENCE } from '../../constants'

/**
 * @description Method to create the message to sign to proof identity to the server
 * The message is created according to the Peach API specs and requires to include the unix current timestamp
 * This method accounts for potential time differences between local and server
 */
export const getAuthenticationChallenge = () => 'Peach Registration ' + String(Date.now() - CLIENTSERVERTIMEDIFFERENCE)
