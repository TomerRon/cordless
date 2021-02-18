import { Message } from 'discord.js'
import { Context, CustomContext } from '../types'

const handleMessage = async <T extends CustomContext>(
  msg: Message,
  context: Context<T>,
): Promise<void> => {
  const { client, functions } = context

  if (!client.user || msg.author.id === client.user.id) {
    return
  }

  const result = functions.find(({ condition }) => condition(msg, context))

  await result?.callback(msg, context)
}

export default handleMessage
