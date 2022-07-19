import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js'
import { BotCommandWithHandler, Context, CustomContext } from '../../types'

interface BuildComponentsArgs<C extends CustomContext = {}> {
  command: BotCommandWithHandler<C>
  interaction: CommandInteraction
  context: Context<C>
}

/**
 * Builds a list of message components for a given BotCommandWithHandler.
 */
const buildComponents = async <C extends CustomContext = {}>({
  command,
  interaction,
  context,
}: BuildComponentsArgs<C>): Promise<MessageActionRow[] | undefined> => {
  const { components } = command

  if (!components?.length) return

  const buttons: MessageButton[] = []

  for (const [i, component] of components.entries()) {
    const { label, style = 'PRIMARY' } = component

    if (component.style === 'LINK') {
      const url =
        typeof component.url === 'string'
          ? component.url
          : await component.url({ interaction, context })

      buttons.push(
        new MessageButton().setLabel(label).setStyle(style).setURL(url),
      )

      continue
    }

    const customId = `${command.name}-${label}-${i}`

    buttons.push(
      new MessageButton().setCustomId(customId).setLabel(label).setStyle(style),
    )
  }

  const row = new MessageActionRow().addComponents(buttons)

  return [row]
}

export default buildComponents
