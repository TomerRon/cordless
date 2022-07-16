import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

type RegisterCommandsArgs = {
  applicationId: string
  commands: SlashCommandBuilder[]
  token: string
}

/**
 * Registers the given application commands with Discord API.
 */
const registerCommands = ({
  applicationId,
  commands,
  token,
}: RegisterCommandsArgs) => {
  const rest = new REST({ version: '10' }).setToken(token)

  rest
    .put(Routes.applicationCommands(applicationId), { body: commands })
    .catch(console.error)
}

export default registerCommands
