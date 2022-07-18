import { CommandInteraction } from 'discord.js'
import { BotCommand, Context, CustomContext } from '../../types'
import isCommandWithHandler from './isCommandWithHandler'

type HandleCommandArgs<C extends CustomContext> = {
  commands: BotCommand<C>[]
  context: Context<C>
  interaction: CommandInteraction
}

const handleCommand = async <C extends CustomContext = {}>({
  commands,
  context,
  interaction,
}: HandleCommandArgs<C>): Promise<void> => {
  const command = commands.find(({ name }) => interaction.commandName === name)

  if (!command) {
    return
  }

  if (isCommandWithHandler(command)) {
    return command.handler({ context, interaction })
  }

  const subcommandName = interaction.options.getSubcommand()

  const subcommand = command.subcommands.find(
    ({ name }) => subcommandName === name,
  )

  if (!subcommand) {
    return
  }

  return subcommand.handler({ context, interaction })
}

export default handleCommand
