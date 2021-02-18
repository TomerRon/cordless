import { init, InitOptions, CustomContext } from '../src'
import { Client, TextChannel, Message } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

export const setupClients = async <T extends CustomContext>(
  options: InitOptions<T>,
): Promise<{
  cordlessClient: Client
  userClient: Client
  e2eChannel: TextChannel
  sendMessageAndWaitForIt: (content: string) => Promise<void>
}> => {
  // Login as the cordless client
  const cordlessClient = init(options)

  await new Promise<void>((resolve) => {
    cordlessClient.on('ready', resolve)

    cordlessClient.login(process.env.E2E_CLIENT_TOKEN)
  })

  // Login as the test user
  const userClient = new Client()

  await new Promise<void>((resolve) => {
    userClient.on('ready', resolve)

    userClient.login(process.env.E2E_USER_TOKEN)
  })

  // Get the channel for e2e testing
  const e2eChannel = userClient.channels.cache.get(
    process.env.E2E_CHANNEL_ID || '',
  ) as TextChannel

  // Sends a message as the user client, and waits until it is received by the cordless client
  const sendMessageAndWaitForIt = (content: string) =>
    new Promise<void>((resolve) => {
      const resolveIfMatchesContent = (msg: Message) => {
        if (msg.content === content) {
          cordlessClient.off('message', resolveIfMatchesContent)
          resolve()
        }
      }

      cordlessClient.on('message', resolveIfMatchesContent)
      e2eChannel.send(content)
    })

  return {
    cordlessClient,
    userClient,
    e2eChannel,
    sendMessageAndWaitForIt,
  }
}
