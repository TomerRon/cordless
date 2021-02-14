import Discord from 'discord.js'
import { InitOptions } from './types'
import handleMessage from './utils/handleMessage'

/**
 * Initializes a cordless bot with the given options.
 * Returns a discord.js client.
 */
export const init = (options: InitOptions): Discord.Client => {
  const client = new Discord.Client()

  client.on('message', (msg) => handleMessage(msg, client, options))

  return client
}
