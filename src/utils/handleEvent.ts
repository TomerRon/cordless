import { ClientEvents } from 'discord.js'
import { BotFunction, Context, CustomContext } from '../types'
import isSelfEvent from './isSelfEvent'

const handleEvent = async <
  E extends keyof ClientEvents,
  C extends CustomContext,
>(
  eventArgs: ClientEvents[E],
  functions: BotFunction<E, C>[],
  context: Context<C>,
): Promise<void> => {
  const { client } = context

  if (!client.user) {
    return
  }

  if (isSelfEvent(eventArgs, client.user.id)) {
    return
  }

  const result = functions.find(({ condition }) =>
    condition(...eventArgs, context),
  )

  await result?.callback(...eventArgs, context)
}

export default handleEvent
