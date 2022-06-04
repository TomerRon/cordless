import Discord, { ClientOptions, Intents } from 'discord.js'
import getHelpFunction from './functions/help'
import { Context, CustomContext, InitOptions } from './types'
import handleMessage from './utils/handleMessage'

const DEFAULT_INTENTS: ClientOptions['intents'] = [
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILDS,
]

/**
 * Initializes a cordless bot with the given options.
 * Returns a discord.js client.
 */
export const init = <T extends CustomContext = {}>(
  options: InitOptions<T>,
): Discord.Client => {
  const { functions, helpCommand, intents = DEFAULT_INTENTS } = options

  if (functions.some((fn) => fn.name?.includes(' '))) {
    throw new Error('A function cannot have spaces in its name.')
  }

  const client = new Discord.Client({ intents })

  const resolvedFns = helpCommand
    ? [getHelpFunction<T>(helpCommand), ...functions]
    : functions

  const context: Context<T> = {
    client,
    functions: resolvedFns,
    ...(options.context as T),
  }

  client.on('messageCreate', (msg) => handleMessage(msg, context))

  return client
}
