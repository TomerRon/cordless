import { ChatInputCommandInteraction } from 'discord.js'
import { BotCommand, Context, CustomContext } from '../../types'
import buildComponents from '../builders/buildComponents'
import { isCommandWithSubcommands } from '../utils/guards'

type HandleCommandArgs<C extends CustomContext> = {
  commands: BotCommand<C>[]
  interaction: ChatInputCommandInteraction
  context: Context<C>
}

const handleCommand = async <C extends CustomContext = {}>({
  commands,
  interaction,
  context,
}: HandleCommandArgs<C>): Promise<void> => {
  let command = commands.find(({ name }) => interaction.commandName === name)

  if (!command) {
    return
  }

  if (isCommandWithSubcommands(command)) {
    const subcommandName = interaction.options.getSubcommand()

    const subcommand = command.subcommands.find(
      ({ name }) => subcommandName === name,
    )

    if (!subcommand) {
      return
    }

    command = subcommand
  }

  const components = await buildComponents({ command, interaction, context })

  await command.handler({
    context,
    interaction,
    components,
  })
}

export default handleCommand
