import { SlashCommandBuilder } from '@discordjs/builders'
import { BotCommand, CustomContext } from '../../types'
import addOptionsToCmd from './addOptionsToCmd'

/**
 * Builds a list of discord.js SlashCommands for a given list of BotCommands.
 */
const build = <C extends CustomContext>(
  commands: BotCommand<C>[],
): SlashCommandBuilder[] =>
  commands.map(({ name, description, options = [] }) => {
    const cmd = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description)

    addOptionsToCmd(cmd, options)

    return cmd
  })

export default build
