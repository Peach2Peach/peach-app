import { EffectCallback } from 'react'
import { error, info } from '../../../utils/log'
import { getChat, getContract } from '../../../utils/peachAPI'

type GetMessagesEffectProps = {
  contractId: string,
  onSuccess: (result: GetChatResponse) => void,
  onError: (error: APIError) => void,
}

// TODO this should be a websocket
export default ({
  contractId,
  onSuccess,
  onError
}: GetMessagesEffectProps): EffectCallback => () => {
  const checkingFunction = async () => {
    if (!contractId) return

    info('Get contract info', contractId)

    const [result, err] = await getChat({
      contractId,
    })

    if (result) {
      const messages = result.map((message: Message) => ({
        ...message,
        date: new Date(message.date),
      }))
      onSuccess(messages)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  }

  const interval = setInterval(checkingFunction, 30 * 1000)
  checkingFunction()

  return () => {
    clearInterval(interval)
  }
}