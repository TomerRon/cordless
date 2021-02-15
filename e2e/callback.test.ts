import { Client, Message, TextChannel } from 'discord.js'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import { init, BotFunction } from '../src'

dotenv.config()

describe('callback', () => {
  let cordlessClient: Client
  let userClient: Client
  let e2eChannel: TextChannel
  let receivedMessages: Message[]

  const pingCallbackSpy = jest.fn()

  const testPing = uuidv4()
  const testWrongPing = uuidv4()
  const testPong = uuidv4()

  beforeEach(() => {
    receivedMessages = []
  })

  beforeEach(jest.clearAllMocks)

  beforeAll(async () => {
    const ping: BotFunction = {
      condition: (msg) => msg.content === testPing,
      callback: (msg) => {
        msg.channel.send(testPong)
        pingCallbackSpy(msg)
      },
    }

    // Login as the cordless client
    cordlessClient = init({ functions: [ping] })
    await new Promise<void>((resolve) => {
      cordlessClient.on('message', (msg) => receivedMessages.push(msg))
      cordlessClient.on('ready', resolve)

      cordlessClient.login(process.env.E2E_CLIENT_TOKEN)
    })

    // Login as the test user
    userClient = new Client()
    await new Promise<void>((resolve) => {
      userClient.on('ready', resolve)

      userClient.login(process.env.E2E_USER_TOKEN)
    })

    // Get the channel for e2e testing
    e2eChannel = userClient.channels.cache.get(
      process.env.E2E_CHANNEL_ID || '',
    ) as TextChannel
  })

  afterAll(() => {
    cordlessClient.destroy()
    userClient.destroy()
  })

  it('should reply to ping with pong when the condition resolves to true', async () => {
    let resolveIfPong: (msg: Message) => void = () => null

    // Wait until pong is received...
    await new Promise<void>((resolve) => {
      resolveIfPong = (msg: Message) => {
        if (msg.content === testPong) {
          resolve()
        }
      }

      cordlessClient.on('message', resolveIfPong)
      e2eChannel.send(testPing)
    })

    cordlessClient.off('message', resolveIfPong)

    expect(pingCallbackSpy).toHaveBeenCalledWith(
      expect.objectContaining({ content: testPing }),
    )

    expect(receivedMessages).toStrictEqual([
      expect.objectContaining({ content: testPing }),
      expect.objectContaining({ content: testPong }),
    ])
  })

  it('should do nothing when the condition resolves to false', async () => {
    await e2eChannel.send(testWrongPing)

    // Wait a couple of seconds to make sure nothing happened...
    await new Promise<void>((resolve) => setTimeout(resolve, 2000))

    expect(pingCallbackSpy).not.toHaveBeenCalled()

    expect(receivedMessages).toStrictEqual([
      expect.objectContaining({ content: testWrongPing }),
    ])
  })
})
