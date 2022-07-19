import { ButtonInteraction } from 'discord.js'
import { BotCommandButtonHandler, Context, CustomContext } from '../../types'

type HandleButtonArgs<C extends CustomContext> = {
  buttonHandlerMap: Record<string, BotCommandButtonHandler<C>>
  interaction: ButtonInteraction
  context: Context<C>
}

const handleButton = <C extends CustomContext = {}>({
  buttonHandlerMap,
  interaction,
  context,
}: HandleButtonArgs<C>): void | Promise<void> => {
  const handler = buttonHandlerMap[interaction.customId]

  if (!handler) return

  return handler({ interaction, context })
}

export default handleButton
