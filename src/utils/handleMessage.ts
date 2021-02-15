import { Client, Message } from 'discord.js'
import { BotFunction } from '../types'

const handleMessage = async (
  msg: Message,
  client: Client,
  functions: BotFunction[],
): Promise<void> => {
  if (!client.user || msg.author.id === client.user.id) {
    return
  }

  const result = functions.find(({ condition }) => condition(msg))

  await result?.callback(msg, functions)
}

export default handleMessage
