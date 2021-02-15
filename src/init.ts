import Discord from 'discord.js'
import getHelpFunction from './functions/help'
import { BotFunction, InitOptions } from './types'
import handleMessage from './utils/handleMessage'

/**
 * Initializes a cordless bot with the given options.
 * Returns a discord.js client.
 */
export const init = (options: InitOptions): Discord.Client => {
  const { functions, helpCommand } = options
  let resolvedFns: BotFunction[] = functions

  if (functions.some((fn) => fn.name?.includes(' '))) {
    throw new Error('A function cannot have spaces in its name.')
  }

  const client = new Discord.Client()

  if (helpCommand) {
    resolvedFns = [getHelpFunction(helpCommand), ...functions]
  }

  client.on('message', (msg) => handleMessage(msg, client, resolvedFns))

  return client
}
