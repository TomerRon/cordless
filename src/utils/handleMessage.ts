import { Client, Message } from 'discord.js'
import { InitOptions } from '../types'

const handleMessage = async (
  msg: Message,
  client: Client,
  options: InitOptions,
): Promise<void> => {
  const { functions } = options

  if (!client.user || msg.author.id === client.user.id) {
    return
  }

  const result = functions.find(({ condition }) => condition(msg))

  await result?.callback(msg)
}

export default handleMessage
