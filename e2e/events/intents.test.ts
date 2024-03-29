import { Client, GatewayIntentBits, Message } from 'discord.js'
import { v4 as uuidv4 } from 'uuid'
import { InitOptions } from '../../src'
import { setupClients } from '../utils'

describe('intents', () => {
  let cordlessClient: Client
  let userClient: Client
  let sendMessageAndWaitForIt: (content: string) => Promise<Message>

  const testPing = `[intents] - ${uuidv4()}`

  const setupTest = async (intents?: InitOptions['intents']) => {
    const setup = await setupClients({
      handlers: [],
      intents,
    })

    cordlessClient = setup.cordlessClient
    userClient = setup.userClient
    sendMessageAndWaitForIt = setup.sendMessageAndWaitForIt
  }

  afterEach(async () => {
    // In this file we have to create a new client in each test
    // So we wait 1 second between tests to prevent flakiness
    await new Promise<void>((resolve) => setTimeout(resolve, 1000))
  })

  describe('when initialized without the GUILD_MESSAGES and MESSAGE_CONTENT intents', () => {
    beforeAll(async () => {
      await setupTest([GatewayIntentBits.Guilds])
    })

    afterAll(() => {
      cordlessClient.destroy()
      userClient.destroy()
    })

    it('should not receive the message', async () => {
      await expect(sendMessageAndWaitForIt(testPing)).rejects.toThrow(
        'Message was not received by the client.',
      )
    })
  })

  describe('when initialized with the GUILD_MESSAGES and MESSAGE_CONTENT intents', () => {
    beforeAll(async () => {
      await setupTest([
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ])
    })

    afterAll(() => {
      cordlessClient.destroy()
      userClient.destroy()
    })

    it('should receive the message', async () => {
      const message = await sendMessageAndWaitForIt(testPing)

      expect(message.id).toBeDefined()
    })
  })
})
