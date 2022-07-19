import { Client } from 'discord.js'
import { BotFunction, Context, CustomContext } from '../types'
import handleEvent from '../utils/handleEvent'

export type InitEventsArgs<C extends CustomContext = {}> = {
  client: Client<true>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  functions: BotFunction<any, C>[]
  context: Context<C>
}

const initEvents = <C extends CustomContext>({
  client,
  functions,
  context,
}: InitEventsArgs<C>) => {
  const eventFunctionsMap = functions.reduce<
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
    client.on(event, (...args) => handleEvent(args, eventFns, context))
  })
}

export default initEvents
