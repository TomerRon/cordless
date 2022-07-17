import { Client } from 'discord.js'
import { BotCommand, Context, CustomContext } from '../types'
import build from './utils/build'
import handleCommand from './utils/handleCommand'
import registerCommands from './utils/registerCommands'

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
  const resolvedCommands = build(commands)

  if (!resolvedCommands.length) {
    return
  }

  registerCommands({
    applicationId: client.application.id,
    commands: resolvedCommands,
    token,
  })

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    await handleCommand({ commands, context, interaction })
  })
}

export default initCommands
