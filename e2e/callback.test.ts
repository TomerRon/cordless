import { Client, Message, TextChannel } from 'discord.js'
import { v4 as uuidv4 } from 'uuid'
import { setupClients } from './utils'
import { BotFunction } from '../src'

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

    const setup = await setupClients({ functions: [ping] })

    cordlessClient = setup.cordlessClient
    userClient = setup.userClient
    e2eChannel = setup.e2eChannel

    cordlessClient.on('message', (msg) => receivedMessages.push(msg))
  })

  afterAll(() => {
    cordlessClient.destroy()
    userClient.destroy()
  })

  it('should reply to ping with pong when the condition resolves to true', async () => {
    let resolveIfPong: (msg: Message) => void = () => null

    // Send ping and wait until the pong response is received...
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
