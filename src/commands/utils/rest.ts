import { SlashCommandBuilder } from 'discord.js'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

type RegisterCommandsArgs = {
  applicationId: string
  commands: SlashCommandBuilder[]
  token: string
}

/**
 * Registers the given application commands with Discord API.
 */
export const registerCommands = ({
  applicationId,
  commands,
  token,
}: RegisterCommandsArgs) => {
  const rest = new REST({ version: '10' }).setToken(token)

  rest
    .put(Routes.applicationCommands(applicationId), { body: commands })
    .catch(console.error)
}
