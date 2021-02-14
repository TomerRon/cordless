import Discord from 'discord.js'
import { InitOptions } from './types'

/**
 * Initializes a cordless bot with the given options.
 * Returns a discord.js client.
 */
export const init = (options: InitOptions): Discord.Client => {
  const { functions } = options
  const client = new Discord.Client()

  client.on('message', async (msg) => {
    if (!client.user || msg.author.id === client.user.id) {
      return
    }

    const result = functions.find(({ condition }) => condition(msg))

    await result?.callback(msg)
  })

  return client
}
