import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
} from 'discord.js'
import { BotCommandWithHandler, Context, CustomContext } from '../../types'

interface BuildComponentsArgs<C extends CustomContext = {}> {
  command: BotCommandWithHandler<C>
  interaction: ChatInputCommandInteraction
  context: Context<C>
}

/**
 * Builds a list of message components for a given BotCommandWithHandler.
 */
const buildComponents = async <C extends CustomContext = {}>({
  command,
  interaction,
  context,
}: BuildComponentsArgs<C>): Promise<
  ActionRowBuilder<ButtonBuilder>[] | undefined
> => {
  const { components } = command

  if (!components?.length) return

  const buttons: ButtonBuilder[] = []

  for (const [i, component] of components.entries()) {
    const { label, style = ButtonStyle.Primary } = component

    if (component.style === ButtonStyle.Link) {
      const url =
        typeof component.url === 'string'
          ? component.url
          : await component.url({ interaction, context })

      buttons.push(
        new ButtonBuilder().setLabel(label).setStyle(style).setURL(url),
      )

      continue
    }

    const customId = `${command.name}-${label}-${i}`

    buttons.push(
      new ButtonBuilder().setCustomId(customId).setLabel(label).setStyle(style),
    )
  }

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)

  return [row]
}

export default buildComponents
