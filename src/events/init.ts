import { Client } from 'discord.js'
import { BotEventHandler, Context, CustomContext } from '../types'
import handleEvent from './handlers/handleEvent'

export type InitEventsArgs<C extends CustomContext = {}> = {
  client: Client<true>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlers: BotEventHandler<any, C>[]
  context: Context<C>
}

const initEvents = <C extends CustomContext>({
  client,
  handlers,
  context,
}: InitEventsArgs<C>) => {
  const eventHandlersMap = handlers.reduce<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, BotEventHandler<any, C>[]>
  >((acc, curr) => {
    const key = curr.event || 'messageCreate'

    return {
      ...acc,
      [key]: [...(acc[key] || []), curr],
    }
  }, {})

  Object.entries(eventHandlersMap).forEach(([event, eventHandlers]) => {
    client.on(event, (...args) => handleEvent(args, eventHandlers, context))
  })
}

export default initEvents
