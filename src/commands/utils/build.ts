import { SlashCommandBuilder } from '@discordjs/builders'
import { BotCommand, CustomContext } from '../../types'
import addOptionsToCmd from './addOptionsToCmd'
import isCommandWithHandler from './isCommandWithHandler'

/**
 * Builds a list of discord.js SlashCommands for a given list of BotCommands.
 */
const build = <C extends CustomContext>(
  commands: BotCommand<C>[],
): SlashCommandBuilder[] =>
  commands.map((command) => {
    const { name, description = 'No description' } = command

    const cmd = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description)

    if (isCommandWithHandler(command)) {
      const { options = [] } = command

      addOptionsToCmd(cmd, options)
    } else {
      command.subcommands.forEach((subcommand) => {
        const {
          name,
          description = 'No description',
          options = [],
        } = subcommand

        cmd.addSubcommand((s) => {
          s.setName(name).setDescription(description)

          addOptionsToCmd(s, options)

          return s
        })
      })
    }

    return cmd
  })

export default build
