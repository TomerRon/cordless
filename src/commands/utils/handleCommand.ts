import { CommandInteraction } from 'discord.js'
import { BotCommand, Context, CustomContext } from '../../types'

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

  await command.handler({ context, interaction })
}

export default handleCommand
