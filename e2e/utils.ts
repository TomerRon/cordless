import { Client, Intents, Message, TextBasedChannel } from 'discord.js'
import dotenv from 'dotenv'
import { CustomContext, init, InitOptions } from '../src'

dotenv.config()

export const setupClients = async <T extends CustomContext>(
  options: InitOptions<T>,
): Promise<{
  cordlessClient: Client
  userClient: Client
  e2eChannel: TextBasedChannel
  sendMessageAndWaitForIt: (content: string) => Promise<void>
}> => {
  // Login as the cordless client
  const cordlessClient = init(options)

  await new Promise<void>((resolve) => {
    cordlessClient.on('ready', () => resolve())

    cordlessClient.login(process.env.E2E_CLIENT_TOKEN)
  })

  // Login as the test user
  const userClient = new Client({
    intents: [Intents.FLAGS.GUILDS],
  })

  await new Promise<void>((resolve) => {
    userClient.on('ready', () => resolve())

    userClient.login(process.env.E2E_USER_TOKEN)
  })

  // Get the channel for e2e testing
  const e2eChannel = userClient.channels.cache.get(
    process.env.E2E_CHANNEL_ID || '',
  )

  if (!e2eChannel) {
    throw new Error('The provided test channel cannot be found.')
  }

  if (!e2eChannel.isText()) {
    throw new Error('The provided test channel is not a text channel.')
  }

  // Sends a message as the user client, and waits until it is received by the cordless client
  const sendMessageAndWaitForIt = (content: string) =>
    new Promise<void>((resolve) => {
      const resolveIfMatchesContent = (msg: Message) => {
        if (msg.content === content) {
          cordlessClient.off('messageCreate', resolveIfMatchesContent)
          resolve()
        }
      }

      cordlessClient.on('messageCreate', resolveIfMatchesContent)
      e2eChannel.send(content)
    })

  return {
    cordlessClient,
    userClient,
    e2eChannel,
    sendMessageAndWaitForIt,
  }
}
