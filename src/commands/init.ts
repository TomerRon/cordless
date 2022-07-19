import { Client } from 'discord.js'
import { BotCommand, Context, CustomContext } from '../types'
import buildCommands from './builders/buildCommands'
import handleButton from './handlers/handleButton'
import handleCommand from './handlers/handleCommand'
import getButtonHandlerMap from './utils/getButtonHandlerMap'
import { registerCommands } from './utils/rest'

export type InitCommandsArgs<C extends CustomContext> = {
  client: Client<true>
  commands: BotCommand<C>[]
  context: Context<C>
  token: string
}

const initCommands = <C extends CustomContext>({
  client,
  commands,
  context,
  token,
}: InitCommandsArgs<C>) => {
  const resolvedCommands = buildCommands(commands)

  registerCommands({
    applicationId: client.application.id,
    commands: resolvedCommands,
    token,
  })

  if (!resolvedCommands.length) {
    return
  }

  const buttonHandlerMap = getButtonHandlerMap(commands)

  client.on('interactionCreate', (interaction) => {
    if (interaction.isCommand()) {
      return handleCommand({
        commands,
        context,
        interaction,
      })
    }

    if (interaction.isButton()) {
      return handleButton({ buttonHandlerMap, interaction, context })
    }
  })
}

export default initCommands
