import Discord, { ClientOptions, Intents } from 'discord.js'
import initCommands from './commands/init'
import getHelpFunction from './functions/help'
import { BotFunction, Context, CustomContext, InitOptions } from './types'
import handleEvent from './utils/handleEvent'

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
    functions,
    helpCommand,
    intents = DEFAULT_INTENTS,
    token,
  } = options

  if (functions.some((fn) => fn.name?.includes(' '))) {
    throw new Error('A function cannot have spaces in its name.')
  }

  //
  // Initialize Discord.js client and login
  //
  const client = await new Promise<Discord.Client<true>>((resolve) => {
    const c = new Discord.Client({ intents })

    c.once('ready', resolve)

    c.login(token)
  })

  //
  // Resolve functions and context
  //
  const resolvedFns = helpCommand
    ? [getHelpFunction<C>(helpCommand), ...functions]
    : functions

  const resolvedContext: Context<C> = {
    client,
    functions: resolvedFns,
    ...context,
  }

  //
  // Subscribe functions to events
  //
  const eventFunctionsMap = resolvedFns.reduce<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, BotFunction<any, C>[]>
  >((acc, curr) => {
    const key = curr.event || 'messageCreate'

    return {
      ...acc,
      [key]: [...(acc[key] || []), curr],
    }
  }, {})

  Object.entries(eventFunctionsMap).forEach(([event, eventFns]) => {
    client.on(event, (...args) => handleEvent(args, eventFns, resolvedContext))
  })

  initCommands<C>({
    client,
    commands,
    context: resolvedContext,
    token,
  })

  return client
}
