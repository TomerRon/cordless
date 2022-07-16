import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

type StartRestClientArgs = {
  applicationId: string
  commands: SlashCommandBuilder[]
  token: string
}

/**
 * Starts a REST client and registers the application commands.
 */
const startRestClient = ({
  applicationId,
  commands,
  token,
}: StartRestClientArgs) => {
  const rest = new REST({ version: '10' }).setToken(token)

  rest
    .put(Routes.applicationCommands(applicationId), { body: commands })
    .catch(console.error)
}

export default startRestClient
