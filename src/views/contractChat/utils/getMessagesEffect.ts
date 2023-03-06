import { EffectCallback } from 'react'
import { error, info } from '../../../utils/log'
import { getChat } from '../../../utils/peachAPI'

type GetMessagesEffectProps = {
  contractId: string
  page?: number
  onSuccess: (result: GetChatResponse) => void
  onError: (err: APIError) => void
}

export default ({ contractId, page = 0, onSuccess, onError }: GetMessagesEffectProps): EffectCallback =>
  () => {
    const checkingFunction = async () => {
      if (!contractId) return

      info('Get chat messages', contractId)

      const [result, err] = await getChat({
        contractId,
        page,
      })

      if (result) {
        const messages = result.reverse().map((message: Message) => ({
          ...message,
          date: new Date(message.date),
        }))
        onSuccess(messages)
      } else if (err) {
        error('Error', err)
        onError(err)
      }
    }

    checkingFunction()
  }
