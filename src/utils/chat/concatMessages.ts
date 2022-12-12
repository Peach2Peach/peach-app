import { unique } from '../array'

export const concatMessages = (oldMessages: Message[], newMessages: Message[]): Message[] =>
  oldMessages
    .concat(newMessages)
    .filter(unique('signature')) // signatures are unique even if the same message is being sent 2x (user intention)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
