import { SlashCommandBuilder } from '@discordjs/builders'
import { BotCommand, CustomContext } from '../../types'

/**
 * Builds a list of discord.js SlashCommands for a given list of BotCommands.
 */
const build = <C extends CustomContext>(
  commands: BotCommand<C>[],
): SlashCommandBuilder[] =>
  commands.map(({ name, description }) => {
    const cmd = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description)

    return cmd
  })

export default build
