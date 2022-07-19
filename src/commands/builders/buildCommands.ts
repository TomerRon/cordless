import { SlashCommandBuilder } from '@discordjs/builders'
import { BotCommand, CustomContext } from '../../types'
import { isCommandWithHandler } from '../utils/guards'
import buildOptions from './buildOptions'

/**
 * Builds a list of discord.js SlashCommands for a given list of BotCommands.
 */
const buildCommands = <C extends CustomContext>(
  commands: BotCommand<C>[],
): SlashCommandBuilder[] =>
  commands.map((command) => {
    const { name, description = 'No description' } = command

    const cmd = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description)

    if (isCommandWithHandler(command)) {
      const { options = [] } = command

      buildOptions(cmd, options)
    } else {
      command.subcommands.forEach((subcommand) => {
        const {
          name,
          description = 'No description',
          options = [],
        } = subcommand

        cmd.addSubcommand((s) => {
          s.setName(name).setDescription(description)

          buildOptions(s, options)

          return s
        })
      })
    }

    return cmd
  })

export default buildCommands
