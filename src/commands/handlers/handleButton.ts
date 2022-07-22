import { ButtonInteraction } from 'discord.js'
import { BotCommandButtonHandler, Context, CustomContext } from '../../types'

type HandleButtonArgs<C extends CustomContext> = {
  buttonHandlerMap: Record<string, BotCommandButtonHandler<C>>
  interaction: ButtonInteraction
  context: Context<C>
}

const handleButton = async <C extends CustomContext = {}>({
  buttonHandlerMap,
  interaction,
  context,
}: HandleButtonArgs<C>): Promise<void> => {
  const handler = buttonHandlerMap[interaction.customId]

  if (!handler) return

  await handler({ interaction, context })
}

export default handleButton
