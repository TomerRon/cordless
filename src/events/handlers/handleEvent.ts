import { ClientEvents } from 'discord.js'
import { BotEventHandler, Context, CustomContext } from '../../types'
import isSelfEvent from '../utils/isSelfEvent'

const handleEvent = async <
  E extends keyof ClientEvents,
  C extends CustomContext,
>(
  eventArgs: ClientEvents[E],
  handlers: BotEventHandler<E, C>[],
  context: Context<C>,
): Promise<void> => {
  const { client } = context

  if (!client.user) {
    return
  }

  if (isSelfEvent(eventArgs, client.user.id)) {
    return
  }

  const result = handlers.find(({ condition }) =>
    condition(...eventArgs, context),
  )

  await result?.callback(...eventArgs, context)
}

export default handleEvent
