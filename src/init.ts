import Discord, { ClientOptions, Intents } from 'discord.js'
import initCommands from './commands/init'
import initEvents from './events/init'
import { Context, CustomContext, InitOptions } from './types'

const DEFAULT_INTENTS: ClientOptions['intents'] = [
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILDS,
]

/**
 * Initializes a cordless bot with the given options.
 * Returns a discord.js client.
 */
export const init = async <C extends CustomContext = {}>(
  options: InitOptions<C>,
): Promise<Discord.Client<true>> => {
  const {
    commands = [],
    context = {} as C,
    handlers = [],
    intents = DEFAULT_INTENTS,
    token,
  } = options

  //
  // Initialize Discord.js client and login
  //
  const client = await new Promise<Discord.Client<true>>((resolve) => {
    const c = new Discord.Client({ intents })

    c.once('ready', resolve)

    c.login(token)
  })

  const resolvedContext: Context<C> = {
    client,
    handlers,
    ...context,
  }

  initCommands<C>({
    client,
    commands,
    context: resolvedContext,
    token,
  })

  initEvents<C>({
    client,
    handlers,
    context: resolvedContext,
  })

  return client
}
